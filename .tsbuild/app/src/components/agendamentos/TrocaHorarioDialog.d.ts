import { Agendamento } from '@/types/agendamento';
interface TrocaHorarioDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    agendamento: Agendamento | null;
    agendamentosDisponiveis: Agendamento[];
    onTrocarHorarios: (agendamento1Id: string, agendamento2Id: string) => Promise<boolean>;
}
export default function TrocaHorarioDialog({ open, onOpenChange, agendamento, agendamentosDisponiveis, onTrocarHorarios, }: TrocaHorarioDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=TrocaHorarioDialog.d.ts.map