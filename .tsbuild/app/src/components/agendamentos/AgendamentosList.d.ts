import { Agendamento, AgendamentoFiltros } from '@/types/agendamento';
interface AgendamentosListProps {
    agendamentos: Agendamento[];
    filtros: AgendamentoFiltros;
    onFiltrosChange: (filtros: AgendamentoFiltros) => void;
    onEdit: (agendamento: Agendamento) => void;
    onDelete: (id: string) => void;
    onCancel: (id: string) => void;
    onViewDetails: (agendamento: Agendamento) => void;
    onReagendar?: (agendamento: Agendamento) => void;
    onTrocarHorario?: (agendamento: Agendamento) => void;
    onMarcarPagamento?: (agendamento: Agendamento) => void;
    clientes: Array<{
        id: string;
        nome: string;
    }>;
    paginaAtual: number;
    totalPaginas: number;
    onPaginaChange: (pagina: number) => void;
}
export default function AgendamentosList({ agendamentos, filtros, onFiltrosChange, onEdit, onDelete, onCancel, onViewDetails, onReagendar, onTrocarHorario, onMarcarPagamento, clientes, paginaAtual, totalPaginas, onPaginaChange, }: AgendamentosListProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=AgendamentosList.d.ts.map