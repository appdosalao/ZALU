import { Cronograma } from "@/types/cronograma";
import { Agendamento } from "@/types/agendamento";
interface CronogramaComAgendamentosProps {
    cronograma?: Cronograma;
    clientes: Array<{
        id: string;
        nome: string;
    }>;
    servicos: Array<{
        id: string;
        nome: string;
        duracao: number;
        valor: number;
    }>;
    agendamentosExistentes: Agendamento[];
    onGerarAgendamentos: (agendamentos: Agendamento[]) => void;
    onSuccess?: () => void;
    onCancel?: () => void;
}
export default function CronogramaComAgendamentos({ cronograma, clientes, servicos, agendamentosExistentes, onGerarAgendamentos, onSuccess, onCancel, }: CronogramaComAgendamentosProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=CronogramaComAgendamentos.d.ts.map