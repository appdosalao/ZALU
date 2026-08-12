import { TipoNotificacao } from '@/types/notificacao';
export declare function useNotificacaoGlobal(): {
    criarNotificacao: (tipo: TipoNotificacao, titulo: string, mensagem: string, dados?: Record<string, any>, programadaPara?: string) => Promise<void>;
    notificarNovoAgendamento: (clienteNome: string, servicoNome: string, data: string, horario: string, origem?: string) => void;
    notificarLembreteAgendamento: (clienteNome: string, servicoNome: string, data: string, horario: string) => void;
    notificarRetornoCronograma: (clienteNome: string, servicoNome: string, dataRetorno: string) => void;
    notificarDespesaFixa: (descricao: string, valor: number, dataVencimento: string, diasRestantes: number) => void;
    notificarServicoFinalizado: (clienteNome: string, servicoNome: string, valor?: number) => void;
};
//# sourceMappingURL=useNotificacaoGlobal.d.ts.map