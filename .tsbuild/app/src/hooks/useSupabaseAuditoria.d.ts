export interface RelatorioAuditoria {
    id: string;
    user_id: string;
    data_execucao: string;
    total_problemas: number;
    problemas_criticos: number;
    problemas_altos: number;
    problemas_medios: number;
    problemas_baixos: number;
    estatisticas: any;
    sugestoes_melhorias: string[];
    created_at: string;
    updated_at: string;
}
export interface ProblemaAuditoria {
    id: string;
    relatorio_id: string;
    user_id: string;
    categoria: 'critico' | 'alto' | 'medio' | 'baixo';
    tipo: string;
    descricao: string;
    entidade: string;
    entidade_id: string;
    campo?: string;
    valor_atual?: string;
    valor_esperado?: string;
    sugestao?: string;
    resolvido: boolean;
    data_resolucao?: string;
    created_at: string;
    updated_at: string;
}
export interface LogSistema {
    id: string;
    user_id?: string;
    nivel: 'info' | 'warning' | 'error' | 'debug';
    categoria: string;
    acao: string;
    descricao: string;
    entidade_tipo?: string;
    entidade_id?: string;
    metadados?: any;
    ip_address?: string;
    user_agent?: string;
    created_at: string;
}
export interface NovoRelatorioAuditoria {
    total_problemas: number;
    problemas_criticos: number;
    problemas_altos: number;
    problemas_medios: number;
    problemas_baixos: number;
    estatisticas: any;
    sugestoes_melhorias: string[];
}
export interface NovoProblemaAuditoria {
    relatorio_id: string;
    categoria: 'critico' | 'alto' | 'medio' | 'baixo';
    tipo: string;
    descricao: string;
    entidade: string;
    entidade_id: string;
    campo?: string;
    valor_atual?: string;
    valor_esperado?: string;
    sugestao?: string;
}
export interface NovoLogSistema {
    nivel: 'info' | 'warning' | 'error' | 'debug';
    categoria: string;
    acao: string;
    descricao: string;
    entidade_tipo?: string;
    entidade_id?: string;
    metadados?: any;
}
export declare const useSupabaseAuditoria: () => {
    relatorios: RelatorioAuditoria[];
    problemas: ProblemaAuditoria[];
    logs: LogSistema[];
    loading: boolean;
    error: string;
    loadRelatorios: () => Promise<void>;
    loadProblemas: (relatorioId?: string) => Promise<void>;
    loadLogs: (filtros?: {
        nivel?: string;
        categoria?: string;
        limite?: number;
    }) => Promise<void>;
    createRelatorio: (relatorio: NovoRelatorioAuditoria) => Promise<string>;
    createProblema: (problema: NovoProblemaAuditoria) => Promise<{
        campo: string | null;
        categoria: string;
        created_at: string;
        data_resolucao: string | null;
        descricao: string;
        entidade: string;
        entidade_id: string;
        id: string;
        relatorio_id: string;
        resolvido: boolean;
        sugestao: string | null;
        tipo: string;
        updated_at: string;
        user_id: string;
        valor_atual: string | null;
        valor_esperado: string | null;
    }>;
    createProblemasLote: (relatorioId: string, problemas: Omit<NovoProblemaAuditoria, "relatorio_id">[]) => Promise<void>;
    resolverProblema: (problemaId: string) => Promise<void>;
    createLog: (log: NovoLogSistema) => Promise<void>;
    getUltimoRelatorio: () => Promise<RelatorioAuditoria | null>;
    getProblemasNaoResolvidos: () => Promise<ProblemaAuditoria[]>;
    getEstatisticasGerais: () => Promise<{
        totalRelatorios: number;
        totalProblemas: number;
        problemasAbertos: number;
        problemasResolvidos: number;
    }>;
};
//# sourceMappingURL=useSupabaseAuditoria.d.ts.map