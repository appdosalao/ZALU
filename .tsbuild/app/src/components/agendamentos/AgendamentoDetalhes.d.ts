import { Agendamento } from '@/types/agendamento';
interface AgendamentoDetalhesProps {
    agendamento: Agendamento;
    cliente: {
        nome: string;
        telefone: string;
        email?: string;
    };
    servico: {
        nome: string;
        descricao?: string;
    };
    onEdit: () => void;
    onBack: () => void;
    onCancel: () => void;
    onMarcarPagamento?: () => void;
}
export default function AgendamentoDetalhes({ agendamento, cliente, servico, onEdit, onBack, onCancel, onMarcarPagamento, }: AgendamentoDetalhesProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=AgendamentoDetalhes.d.ts.map