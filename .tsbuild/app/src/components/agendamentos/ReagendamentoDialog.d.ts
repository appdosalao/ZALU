import { Agendamento } from '@/types/agendamento';
interface ReagendamentoDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    agendamento: Agendamento | null;
    onReagendar: (agendamentoId: string, novoData: string, novoHora: string) => Promise<boolean>;
    verificarConflito: (agendamento: any, excluirId?: string) => boolean;
}
export default function ReagendamentoDialog({ open, onOpenChange, agendamento, onReagendar, verificarConflito, }: ReagendamentoDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ReagendamentoDialog.d.ts.map