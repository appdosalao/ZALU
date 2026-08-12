import { Lancamento, NovoLancamento, LancamentoFiltros, ResumoFinanceiro } from '@/types/lancamento';
export declare const useSupabaseLancamentos: () => {
    lancamentos: Lancamento[];
    loading: boolean;
    error: string;
    createLancamento: (lancamento: NovoLancamento) => Promise<boolean>;
    updateLancamento: (id: string, updates: Partial<Lancamento>) => Promise<boolean>;
    deleteLancamento: (id: string) => Promise<void>;
    filterLancamentos: (filtros: LancamentoFiltros) => Lancamento[];
    calculateResumoFinanceiro: () => ResumoFinanceiro;
    createLancamentoFromAgendamento: (agendamento: any) => Promise<{
        categoria: string | null;
        cliente_id: string | null;
        created_at: string;
        data: string;
        descricao: string;
        id: string;
        origem_id: string | null;
        origem_tipo: string | null;
        tipo: string;
        updated_at: string;
        user_id: string;
        valor: number;
    }>;
    createLancamentoFromContaFixa: (contaFixa: any, valorPago: number, dataPagamento: Date) => Promise<{
        categoria: string | null;
        cliente_id: string | null;
        created_at: string;
        data: string;
        descricao: string;
        id: string;
        origem_id: string | null;
        origem_tipo: string | null;
        tipo: string;
        updated_at: string;
        user_id: string;
        valor: number;
    }>;
    loadLancamentos: (dataInicioParam?: string, dataFimParam?: string) => Promise<void>;
};
//# sourceMappingURL=useSupabaseLancamentos.d.ts.map