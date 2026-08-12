import { Cronograma, Retorno } from '@/types/cronograma';
interface CronogramaCompleto extends Cronograma {
    cliente_nome_real?: string;
    cliente_telefone?: string;
    cliente_email?: string;
    servico_nome_real?: string;
    servico_valor?: number;
    servico_duracao?: number;
    total_retornos: number;
    retornos_pendentes: number;
    retornos_realizados: number;
    proximo_retorno?: string;
}
interface RetornoCompleto extends Retorno {
    cliente_nome?: string;
    cliente_telefone?: string;
    tipo_servico?: string;
    hora_inicio?: string;
    recorrencia?: string;
    agendamento_data?: string;
    agendamento_hora?: string;
    agendamento_status?: string;
}
export declare const useSupabaseCronogramas: () => {
    cronogramas: CronogramaCompleto[];
    retornos: RetornoCompleto[];
    loading: boolean;
    error: string;
    createCronograma: (cronograma: Omit<Cronograma, "id_cronograma" | "created_at" | "updated_at">) => Promise<{
        cliente_id: string;
        cliente_nome: string;
        created_at: string;
        data_inicio: string;
        duracao_minutos: number;
        hora_inicio: string;
        id_cronograma: string;
        intervalo_dias: number | null;
        observacoes: string | null;
        recorrencia: string;
        servico_id: string;
        status: string;
        tipo_servico: string;
        updated_at: string;
        user_id: string;
    }>;
    updateCronograma: (id: string, updates: Partial<Cronograma>) => Promise<void>;
    deleteCronograma: (id: string) => Promise<void>;
    createRetorno: (retorno: Omit<Retorno, "id_retorno" | "created_at" | "updated_at">) => Promise<{
        created_at: string;
        data_retorno: string;
        id_agendamento_retorno: string | null;
        id_cliente: string;
        id_cronograma: string;
        id_retorno: string;
        status: string;
        updated_at: string;
        user_id: string;
    }>;
    updateRetorno: (id: string, updates: Partial<Retorno>) => Promise<void>;
    criarAgendamentoDeRetorno: (retornoId: string, dataAgendamento: string, horaAgendamento: string) => Promise<{
        cliente_id: string;
        confirmado: boolean | null;
        created_at: string;
        data: string;
        duracao: number;
        forma_pagamento: string | null;
        hora: string;
        id: string;
        observacoes: string | null;
        origem: string | null;
        prioridade: string | null;
        servico_id: string;
        status: string | null;
        status_pagamento: string | null;
        updated_at: string;
        user_id: string;
        valor: number;
        valor_devido: number;
        valor_pago: number | null;
    }>;
    loadCronogramas: () => Promise<void>;
    loadRetornos: () => Promise<void>;
};
export {};
//# sourceMappingURL=useSupabaseCronogramas.d.ts.map