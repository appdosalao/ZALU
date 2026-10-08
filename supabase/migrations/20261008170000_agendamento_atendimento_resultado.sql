DO $$
DECLARE
  constraint_name TEXT;
BEGIN
  FOR constraint_name IN
    SELECT c.conname
    FROM pg_constraint c
    WHERE c.conrelid = 'public.agendamentos'::regclass
      AND c.contype = 'c'
      AND pg_get_constraintdef(c.oid) ~* '\mstatus\M'
  LOOP
    EXECUTE format('ALTER TABLE public.agendamentos DROP CONSTRAINT %I', constraint_name);
  END LOOP;
END $$;

ALTER TABLE public.agendamentos
  ADD CONSTRAINT agendamentos_status_check
  CHECK (status IN ('agendado', 'concluido', 'cancelado', 'excluido', 'nao_compareceu'));

CREATE OR REPLACE FUNCTION public.sync_agendamento_to_financeiro()
RETURNS TRIGGER AS $$
DECLARE
    v_lancamento_id UUID;
    v_descricao TEXT;
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        IF (OLD.valor_pago = NEW.valor_pago AND
            OLD.data = NEW.data AND
            OLD.status = NEW.status AND
            OLD.cliente_id IS NOT DISTINCT FROM NEW.cliente_id AND
            OLD.lancamento_id IS NOT DISTINCT FROM NEW.lancamento_id) THEN
            RETURN NEW;
        END IF;
    END IF;

    IF (NEW.status IN ('concluido', 'nao_compareceu') AND NEW.valor_pago > 0) THEN
        v_descricao := CASE
            WHEN NEW.status = 'nao_compareceu' THEN 'Pagamento antecipado (cliente não compareceu)'
            ELSE 'Serviço prestado (Concluído)'
        END;

        IF (NEW.lancamento_id IS NULL) THEN
            INSERT INTO public.lancamentos (
                user_id,
                tipo,
                valor,
                data,
                descricao,
                categoria,
                origem_id,
                origem_tipo,
                cliente_id
            ) VALUES (
                NEW.user_id,
                'entrada',
                NEW.valor_pago,
                NEW.data,
                v_descricao,
                'Serviços Prestados',
                NEW.id,
                'agendamento',
                NEW.cliente_id
            ) RETURNING id INTO v_lancamento_id;

            UPDATE public.agendamentos SET lancamento_id = v_lancamento_id WHERE id = NEW.id;
        ELSE
            UPDATE public.lancamentos SET
                valor = NEW.valor_pago,
                data = NEW.data,
                descricao = v_descricao,
                cliente_id = NEW.cliente_id,
                updated_at = now()
            WHERE id = NEW.lancamento_id;
        END IF;
    ELSE
        IF (OLD.lancamento_id IS NOT NULL) THEN
            DELETE FROM public.lancamentos WHERE id = OLD.lancamento_id;
            UPDATE public.agendamentos SET lancamento_id = NULL WHERE id = NEW.id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
