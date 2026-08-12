import { Agendamento, AgendamentoFiltros } from '@/types/agendamento';
export declare function useSupabaseAgendamentos(): {
    loading: boolean;
    agendamentos: Agendamento[];
    agendamentosFiltrados: Agendamento[];
    todosAgendamentos: Agendamento[];
    filtros: AgendamentoFiltros;
    setFiltros: import("react").Dispatch<import("react").SetStateAction<AgendamentoFiltros>>;
    paginaAtual: number;
    setPaginaAtual: import("react").Dispatch<import("react").SetStateAction<number>>;
    totalPaginas: number;
    criarAgendamento: (novoAgendamento: any) => Promise<boolean>;
    atualizarAgendamento: (id: string, dadosAtualizados: any) => Promise<boolean>;
    excluirAgendamento: (id: string) => Promise<boolean>;
    cancelarAgendamento: (id: string) => Promise<boolean>;
    recarregar: (mesFiltroArg?: string) => Promise<void>;
    converterAgendamentoOnlineParaRegular: (agendamentoOnlineId: string) => Promise<boolean>;
    confirmarAgendamentoOnline: (agendamentoOnlineId: string) => Promise<boolean>;
    verificarHorarioDisponivel: (data: string, hora: string) => Promise<boolean>;
};
//# sourceMappingURL=useSupabaseAgendamentos.d.ts.map