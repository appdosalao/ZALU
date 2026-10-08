-- Migration segura: conflito atômico + rate limit público
-- NÃO quebra agendamento manual: validação só via RPC quando origem != manual ou via frontend opt-in

CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 1) Helper timezone fixo salão (America/Sao_Paulo)
CREATE OR REPLACE FUNCTION public._booking_tstz(p_data text, p_hora text)
RETURNS timestamptz LANGUAGE sql IMMUTABLE AS $$
  SELECT ((p_data || 'T' || left(p_hora,5) || ':00')::timestamp AT TIME ZONE 'America/Sao_Paulo');
$$;

-- 2) Verificação de conflito (usada por RPC e triggers)
CREATE OR REPLACE FUNCTION public.verificar_conflito_agendamento(
  p_user_id uuid,
  p_data text,
  p_hora text,
  p_duracao int,
  p_excluir_id uuid DEFAULT NULL
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_inicio timestamptz := public._booking_tstz(p_data, p_hora);
DECLARE v_fim timestamptz := v_inicio + (p_duracao || ' minutes')::interval;
DECLARE v_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.agendamentos
    WHERE user_id = p_user_id
      AND status NOT IN ('cancelado','excluido')
      AND data = p_data
      AND (p_excluir_id IS NULL OR id <> p_excluir_id)
      AND public._booking_tstz(data, hora) < v_fim
      AND public._booking_tstz(data, hora) + (duracao || ' minutes')::interval > v_inicio
    FOR UPDATE
  ) INTO v_exists;
  RETURN v_exists;
END; $$;

-- 3) RPC atômico para criar agendamento com lock
CREATE OR REPLACE FUNCTION public.criar_agendamento_seguro(
  p_cliente_id uuid,
  p_servico_id uuid,
  p_data text,
  p_hora text,
  p_duracao int,
  p_valor numeric,
  p_valor_pago numeric DEFAULT 0,
  p_valor_devido numeric DEFAULT NULL,
  p_forma_pagamento text DEFAULT 'fiado',
  p_status_pagamento text DEFAULT 'em_aberto',
  p_status text DEFAULT 'agendado',
  p_origem text DEFAULT 'manual',
  p_confirmado boolean DEFAULT true,
  p_observacoes text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_user uuid := auth.uid();
DECLARE v_id uuid := gen_random_uuid();
DECLARE v_valor_devido numeric := COALESCE(p_valor_devido, GREATEST(0, p_valor - p_valor_pago));
DECLARE v_conflito boolean;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  IF p_origem <> 'manual' THEN
    -- respeita horário disponível já existente via buscar_horarios_com_multiplos_intervalos seria redundante; conflito é suficiente
    NULL;
  END IF;
  PERFORM pg_advisory_xact_lock(hashtext(v_user::text || '|' || p_data));
  v_conflito := public.verificar_conflito_agendamento(v_user, p_data, left(p_hora,5), p_duracao, NULL);
  IF v_conflito THEN RAISE EXCEPTION 'Horário em conflito' USING ERRCODE='23P01'; END IF;
  INSERT INTO public.agendamentos(id, user_id, cliente_id, servico_id, data, hora, duracao, valor, valor_pago, valor_devido, forma_pagamento, status_pagamento, status, origem, confirmado, observacoes)
  VALUES (v_id, v_user, p_cliente_id, p_servico_id, left(p_data,10), left(p_hora,5), p_duracao, p_valor, p_valor_pago, v_valor_devido, p_forma_pagamento, p_status_pagamento, p_status, p_origem, p_confirmado, p_observacoes);
  RETURN v_id;
END; $$;

GRANT EXECUTE ON FUNCTION public.verificar_conflito_agendamento(uuid,text,text,int,uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.criar_agendamento_seguro(uuid,uuid,text,text,int,numeric,numeric,numeric,text,text,text,text,boolean,text) TO authenticated;

-- 4) Rate limit público (hash IP + public_id)
CREATE TABLE IF NOT EXISTS public.booking_rate_limit(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash text NOT NULL,
  public_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_booking_rate_limit_window ON public.booking_rate_limit(public_id, ip_hash, created_at);
ALTER TABLE public.booking_rate_limit ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "no select anon" ON public.booking_rate_limit;
CREATE POLICY "no select anon" ON public.booking_rate_limit FOR SELECT TO anon USING (false);
GRANT INSERT ON public.booking_rate_limit TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.check_booking_rate_limit(p_ip_hash text, p_public_id text, p_max_per_min int DEFAULT 3)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_cnt int;
BEGIN
  SELECT count(*) INTO v_cnt FROM public.booking_rate_limit
  WHERE public_id = p_public_id AND ip_hash = p_ip_hash AND created_at > now() - interval '1 minute';
  IF v_cnt >= p_max_per_min THEN RETURN false; END IF;
  INSERT INTO public.booking_rate_limit(ip_hash, public_id) VALUES (p_ip_hash, p_public_id);
  -- limpeza rápida
  DELETE FROM public.booking_rate_limit WHERE created_at < now() - interval '1 hour';
  RETURN true;
END; $$;
GRANT EXECUTE ON FUNCTION public.check_booking_rate_limit(text,text,int) TO anon, authenticated;
