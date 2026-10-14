ALTER TABLE public.usuarios
  ADD COLUMN IF NOT EXISTS is_divulgador boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS indicado_por uuid REFERENCES public.usuarios(id) ON DELETE RESTRICT;

CREATE TABLE IF NOT EXISTS public.affiliate_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  default_commission_rate numeric(5,2) NOT NULL DEFAULT 10.00
    CHECK (default_commission_rate >= 0 AND default_commission_rate <= 100),
  commission_mode text NOT NULL DEFAULT 'recurring'
    CHECK (commission_mode IN ('recurring', 'first_payment')),
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.affiliate_settings (id)
VALUES (true)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.affiliate_profiles (
  user_id uuid PRIMARY KEY REFERENCES public.usuarios(id) ON DELETE CASCADE,
  referral_code text NOT NULL UNIQUE
    CHECK (referral_code = upper(referral_code) AND referral_code ~ '^[A-Z0-9]{6,8}$'),
  commission_rate numeric(5,2) NOT NULL
    CHECK (commission_rate >= 0 AND commission_rate <= 100),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.referral_commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid NOT NULL REFERENCES public.affiliate_profiles(user_id) ON DELETE RESTRICT,
  referred_user_id uuid NOT NULL REFERENCES public.usuarios(id) ON DELETE RESTRICT,
  payment_reference text NOT NULL,
  payment_amount numeric(12,2) NOT NULL CHECK (payment_amount > 0),
  commission_rate numeric(5,2) NOT NULL CHECK (commission_rate >= 0 AND commission_rate <= 100),
  commission_amount numeric(12,2) NOT NULL CHECK (commission_amount >= 0),
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'cancelled')),
  payment_received_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (payment_reference)
);

CREATE INDEX IF NOT EXISTS referral_commissions_affiliate_created_idx
  ON public.referral_commissions (affiliate_id, created_at DESC);
CREATE INDEX IF NOT EXISTS referral_commissions_referred_idx
  ON public.referral_commissions (referred_user_id);

ALTER TABLE public.affiliate_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_commissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Affiliates can view their own profile" ON public.affiliate_profiles;
CREATE POLICY "Affiliates can view their own profile"
  ON public.affiliate_profiles
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Affiliates can view their own commissions" ON public.referral_commissions;
CREATE POLICY "Affiliates can view their own commissions"
  ON public.referral_commissions
  FOR SELECT TO authenticated
  USING (affiliate_id = (SELECT auth.uid()));

GRANT SELECT ON public.affiliate_profiles, public.referral_commissions TO authenticated;
GRANT ALL ON public.affiliate_settings, public.affiliate_profiles, public.referral_commissions TO service_role;
GRANT SELECT ON public.usuarios TO authenticated;
GRANT ALL ON public.usuarios TO service_role;

CREATE OR REPLACE FUNCTION public.protect_referral_user_fields()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.indicado_por IS DISTINCT FROM OLD.indicado_por THEN
    RAISE EXCEPTION 'O vínculo de indicação não pode ser alterado';
  END IF;

  IF NEW.is_divulgador IS DISTINCT FROM OLD.is_divulgador
     AND COALESCE(auth.role(), '') <> 'service_role' THEN
    RAISE EXCEPTION 'Somente o administrador pode alterar o status de divulgador';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_referral_user_fields ON public.usuarios;
CREATE TRIGGER protect_referral_user_fields
  BEFORE UPDATE OF indicado_por, is_divulgador ON public.usuarios
  FOR EACH ROW EXECUTE FUNCTION public.protect_referral_user_fields();

CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan_type text;
  v_trial_start timestamptz;
  v_subscription_status text;
  v_email text;
  v_referral_code text;
  v_referrer_id uuid;
BEGIN
  v_email := COALESCE(NEW.email, '');
  v_plan_type := COALESCE(NEW.raw_user_meta_data->>'plan_type', 'trial');
  v_trial_start := CASE WHEN v_plan_type = 'trial' THEN now() ELSE NULL END;
  v_subscription_status := CASE WHEN v_plan_type = 'paid' THEN 'inactive' ELSE v_plan_type END;
  v_referral_code := upper(trim(COALESCE(NEW.raw_user_meta_data->>'referral_code', '')));

  IF v_referral_code <> '' THEN
    SELECT profile.user_id
      INTO v_referrer_id
      FROM public.affiliate_profiles AS profile
     WHERE profile.referral_code = v_referral_code
       AND profile.active = true
       AND profile.user_id <> NEW.id;
  END IF;

  INSERT INTO public.usuarios (
    id,
    email,
    nome_completo,
    nome_personalizado_app,
    telefone,
    tema_preferencia,
    trial_start_date,
    trial_used,
    subscription_status,
    indicado_por,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    v_email,
    COALESCE(NEW.raw_user_meta_data->>'nome_completo', ''),
    COALESCE(NEW.raw_user_meta_data->>'nome_personalizado_app', 'Meu Salão'),
    COALESCE(NEW.raw_user_meta_data->>'telefone', ''),
    COALESCE(NEW.raw_user_meta_data->>'tema_preferencia', 'feminino'),
    v_trial_start,
    false,
    v_subscription_status,
    v_referrer_id,
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    nome_completo = CASE
      WHEN public.usuarios.nome_completo IS NULL OR public.usuarios.nome_completo = ''
      THEN EXCLUDED.nome_completo ELSE public.usuarios.nome_completo END,
    nome_personalizado_app = CASE
      WHEN public.usuarios.nome_personalizado_app IS NULL OR public.usuarios.nome_personalizado_app = ''
      THEN EXCLUDED.nome_personalizado_app ELSE public.usuarios.nome_personalizado_app END,
    telefone = CASE
      WHEN public.usuarios.telefone IS NULL OR public.usuarios.telefone = ''
      THEN EXCLUDED.telefone ELSE public.usuarios.telefone END,
    tema_preferencia = COALESCE(public.usuarios.tema_preferencia, EXCLUDED.tema_preferencia),
    trial_start_date = COALESCE(public.usuarios.trial_start_date, EXCLUDED.trial_start_date),
    trial_used = (public.usuarios.trial_used OR EXCLUDED.trial_used),
    subscription_status = CASE
      WHEN public.usuarios.subscription_status IS NULL OR public.usuarios.subscription_status = 'inactive'
      THEN EXCLUDED.subscription_status ELSE public.usuarios.subscription_status END,
    updated_at = now();

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.record_referral_commission(
  p_referred_user_id uuid,
  p_payment_reference text,
  p_payment_amount numeric
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_affiliate public.affiliate_profiles%ROWTYPE;
  v_mode text;
  v_commission numeric(12,2);
  v_result public.referral_commissions%ROWTYPE;
BEGIN
  IF COALESCE(auth.role(), '') <> 'service_role' THEN
    RAISE EXCEPTION 'Acesso não autorizado';
  END IF;
  IF p_payment_reference IS NULL OR length(trim(p_payment_reference)) = 0
     OR p_payment_amount IS NULL OR p_payment_amount <= 0 THEN
    RAISE EXCEPTION 'Pagamento inválido para comissão';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.referral_commissions
    WHERE payment_reference = trim(p_payment_reference)
  ) THEN
    RETURN jsonb_build_object('created', false, 'reason', 'duplicate');
  END IF;

  SELECT profile.*
    INTO v_affiliate
    FROM public.usuarios AS referred
    JOIN public.affiliate_profiles AS profile
      ON profile.user_id = referred.indicado_por
   WHERE referred.id = p_referred_user_id
     AND profile.active = true
     AND referred.id <> profile.user_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('created', false, 'reason', 'no_active_referrer');
  END IF;

  SELECT commission_mode INTO v_mode
    FROM public.affiliate_settings WHERE id = true;
  v_mode := COALESCE(v_mode, 'recurring');

  IF v_mode = 'first_payment' AND EXISTS (
    SELECT 1 FROM public.referral_commissions
    WHERE referred_user_id = p_referred_user_id
  ) THEN
    RETURN jsonb_build_object('created', false, 'reason', 'first_payment_already_commissioned');
  END IF;

  v_commission := round(p_payment_amount * v_affiliate.commission_rate / 100, 2);
  INSERT INTO public.referral_commissions (
    affiliate_id,
    referred_user_id,
    payment_reference,
    payment_amount,
    commission_rate,
    commission_amount
  )
  VALUES (
    v_affiliate.user_id,
    p_referred_user_id,
    trim(p_payment_reference),
    round(p_payment_amount, 2),
    v_affiliate.commission_rate,
    v_commission
  )
  ON CONFLICT (payment_reference) DO NOTHING
  RETURNING * INTO v_result;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('created', false, 'reason', 'duplicate');
  END IF;

  RETURN jsonb_build_object('created', true, 'commission_id', v_result.id);
END;
$$;

CREATE OR REPLACE FUNCTION public.cancel_referral_commission(
  p_referred_user_id uuid,
  p_payment_reference text
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_updated integer;
BEGIN
  IF COALESCE(auth.role(), '') <> 'service_role' THEN
    RAISE EXCEPTION 'Acesso não autorizado';
  END IF;
  UPDATE public.referral_commissions
     SET status = 'cancelled',
         cancelled_at = COALESCE(cancelled_at, now())
   WHERE referred_user_id = p_referred_user_id
     AND (
       (p_payment_reference IS NOT NULL
        AND payment_reference = trim(p_payment_reference)
        AND status <> 'cancelled')
       OR
       (p_payment_reference IS NULL AND status = 'pending')
     );

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_affiliate_profile(
  p_user_id uuid,
  p_active boolean,
  p_referral_code text DEFAULT NULL,
  p_commission_rate numeric DEFAULT NULL
)
RETURNS public.affiliate_profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profile public.affiliate_profiles%ROWTYPE;
  v_rate numeric(5,2);
  v_code text;
BEGIN
  IF COALESCE(auth.role(), '') <> 'service_role' THEN
    RAISE EXCEPTION 'Acesso não autorizado';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.usuarios WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Usuário não encontrado';
  END IF;

  IF p_active THEN
    SELECT * INTO v_profile
      FROM public.affiliate_profiles
     WHERE user_id = p_user_id;
    SELECT default_commission_rate INTO v_rate
      FROM public.affiliate_settings
     WHERE id = true;

    v_rate := COALESCE(p_commission_rate, v_profile.commission_rate, v_rate, 10.00);
    v_code := COALESCE(p_referral_code, v_profile.referral_code);
    IF v_code IS NULL THEN
      RAISE EXCEPTION 'Código de indicação ausente';
    END IF;

    INSERT INTO public.affiliate_profiles (
      user_id, referral_code, commission_rate, active
    )
    VALUES (p_user_id, upper(trim(v_code)), v_rate, true)
    ON CONFLICT (user_id) DO UPDATE
      SET referral_code = EXCLUDED.referral_code,
          commission_rate = EXCLUDED.commission_rate,
          active = true,
          updated_at = now()
    RETURNING * INTO v_profile;

    UPDATE public.usuarios
       SET is_divulgador = true
     WHERE id = p_user_id;
  ELSE
    UPDATE public.affiliate_profiles
       SET active = false,
           referral_code = COALESCE(upper(trim(p_referral_code)), referral_code),
           commission_rate = COALESCE(p_commission_rate, commission_rate),
           updated_at = now()
     WHERE user_id = p_user_id
     RETURNING * INTO v_profile;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Perfil de divulgador não encontrado';
    END IF;
    UPDATE public.usuarios
       SET is_divulgador = false
     WHERE id = p_user_id;
  END IF;

  RETURN v_profile;
END;
$$;

REVOKE ALL ON FUNCTION public.record_referral_commission(uuid, text, numeric) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.cancel_referral_commission(uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_affiliate_profile(uuid, boolean, text, numeric) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_referral_commission(uuid, text, numeric) TO service_role;
GRANT EXECUTE ON FUNCTION public.cancel_referral_commission(uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.set_affiliate_profile(uuid, boolean, text, numeric) TO service_role;
