import { Agendamento } from '@/types/agendamento';
interface PagamentoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    agendamento: Agendamento | null;
    onConfirmar: (agendamentoId: string, valorPago: number, formaPagamento: string) => Promise<boolean>;
}
export default function PagamentoDialog({ open, onOpenChange, agendamento, onConfirmar, }: PagamentoDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PagamentoDialog.d.ts.map