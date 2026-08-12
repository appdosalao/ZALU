export type NivelLog = 'info' | 'warning' | 'error' | 'critical';
export type CategoriaLog = 'auth' | 'agendamento' | 'financeiro' | 'cliente' | 'servico' | 'cronograma' | 'sistema' | 'backup';
export interface LogSistema {
    nivel: NivelLog;
    categoria: CategoriaLog;
    acao: string;
    descricao: string;
    entidade_tipo?: string;
    entidade_id?: string;
    metadados?: Record<string, any>;
}
export declare function useAuditoriaGlobal(): {
    logarAcao: (log: LogSistema) => Promise<void>;
    logAgendamento: {
        criar: (agendamentoId: string, clienteNome: string, servicoNome: string) => Promise<void>;
        atualizar: (agendamentoId: string, campo: string, valorAnterior: any, valorNovo: any) => Promise<void>;
        cancelar: (agendamentoId: string, motivo?: string) => Promise<void>;
        concluir: (agendamentoId: string, valorPago: number) => Promise<void>;
    };
    logFinanceiro: {
        criarLancamento: (lancamentoId: string, tipo: string, valor: number, descricao: string) => Promise<void>;
        pagarConta: (contaId: string, nome: string, valor: number) => Promise<void>;
        backup: (sucesso: boolean, detalhes?: string) => Promise<void>;
    };
    logCliente: {
        criar: (clienteId: string, nome: string) => Promise<void>;
        atualizar: (clienteId: string, nome: string) => Promise<void>;
        deletar: (clienteId: string, nome: string) => Promise<void>;
    };
    logServico: {
        criar: (servicoId: string, nome: string, valor: number) => Promise<void>;
        atualizar: (servicoId: string, nome: string) => Promise<void>;
        deletar: (servicoId: string, nome: string) => Promise<void>;
    };
    logCronograma: {
        criar: (cronogramaId: string, clienteNome: string, servicoNome: string) => Promise<void>;
        ativar: (cronogramaId: string, agendamentosCriados: number) => Promise<void>;
        cancelar: (cronogramaId: string) => Promise<void>;
    };
    logSistema: {
        login: () => Promise<void>;
        logout: () => Promise<void>;
        configuracao: (tipo: string, descricao: string) => Promise<void>;
        erro: (erro: string, contexto?: string) => Promise<void>;
    };
};
//# sourceMappingURL=useAuditoriaGlobal.d.ts.map