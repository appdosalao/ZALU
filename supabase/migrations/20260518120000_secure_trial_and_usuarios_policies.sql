BEGIN;

CREATE OR REPLACE FUNCTION public.check_trial_status(user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  user_record RECORD;
BEGIN
  SELECT paid_access, subscription_status, trial_start_date
  INTO user_record
  FROM public.usuarios
  WHERE id = user_id;

  IF user_record IS NULL THEN
    RETURN 'expired';
  END IF;

  IF user_record.paid_access IS TRUE OR user_record.subscription_status = 'active' THEN
    RETURN 'active';
  END IF;

  IF user_record.trial_start_date IS NULL THEN
    RETURN 'expired';
  END IF;

  IF now() < user_record.trial_start_date + interval '7 days' THEN
    RETURN 'trial';
  END IF;

  RETURN 'expired';
END;
$$;

CREATE OR REPLACE FUNCTION public.can_access_app(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  status text;
BEGIN
  status := public.check_trial_status(user_id);
  RETURN status IN ('active', 'trial');
END;
$$;

REVOKE UPDATE ON public.usuarios FROM authenticated;
GRANT UPDATE (nome_completo, nome_personalizado_app, telefone, tema_preferencia) ON public.usuarios TO authenticated;

COMMIT;
