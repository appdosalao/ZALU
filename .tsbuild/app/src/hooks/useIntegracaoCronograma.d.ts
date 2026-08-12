import { Cronograma } from '@/types/cronograma';
import { Agendamento } from '@/types/agendamento';
interface AgendamentoCronograma {
    clienteId: string;
    clienteNome: string;
    servicoId: string;
    servicoNome: string;
    data: string;
    duracao: number;
    valor: number;
    cronogramaId: string;
}
export declare const useIntegracaoCronograma: () => {
    loading: boolean;
    gerarAgendamentosCronograma: (cronograma: Cronograma, dadosAgendamento: AgendamentoCronograma, dataInicio: string, numeroSessoes: number, agendamentosExistentes: Agendamento[]) => Agendamento[];
    processarConclusaoAgendamento: (agendamento: Agendamento, onUpdateRetorno: (idRetorno: string, updates: any) => void) => void;
    processarCancelamentoAgendamento: (agendamento: Agendamento, onUpdateRetorno: (idRetorno: string, updates: any) => void) => void;
    encontrarHorarioDisponivel: (data: string, duracaoMinutos: number, agendamentosExistentes: Agendamento[], horaPreferida?: string) => string;
};
export {};
//# sourceMappingURL=useIntegracaoCronograma.d.ts.map