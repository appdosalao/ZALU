export interface ProblemaAuditoria {
    id: string;
    categoria: 'critico' | 'alto' | 'medio' | 'baixo';
    tipo: string;
    descricao: string;
    entidade: string;
    entidadeId: string;
    campo?: string;
    valorAtual?: any;
    valorEsperado?: any;
    sugestao?: string;
}
export interface RelatorioAuditoria {
    dataExecucao: string;
    totalProblemas: number;
    problemasCriticos: number;
    problemasAltos: number;
    problemasMedios: number;
    problemasBaixos: number;
    problemas: ProblemaAuditoria[];
    estatisticas: {
        totalClientes: number;
        totalServicos: number;
        totalAgendamentos: number;
        totalLancamentos: number;
        totalCronogramas: number;
        totalRetornos: number;
        agendamentosAtivos: number;
        agendamentosConcluidos: number;
        agendamentosCancelados: number;
        valorTotalReceitas: number;
        valorTotalDespesas: number;
        servicosNuncaUsados: number;
        clientesInativos: number;
    };
    sugestoesMelhorias: string[];
}
export declare function useAuditoria(): {
    relatorioAuditoria: RelatorioAuditoria;
    exportarRelatorio: (formato: "json" | "csv") => void;
    salvarRelatorio: () => Promise<{
        created_at: string;
        data_execucao: string;
        estatisticas: import("../integrations/supabase/types").Json;
        id: string;
        problemas_altos: number;
        problemas_baixos: number;
        problemas_criticos: number;
        problemas_medios: number;
        sugestoes_melhorias: string[] | null;
        total_problemas: number;
        updated_at: string;
        user_id: string;
    }>;
    salvando: boolean;
    carregarHistorico: () => Promise<void>;
    relatoriosHistorico: any[];
    carregandoBackend: boolean;
    executarAgora: () => Promise<boolean>;
    origemRelatorio: string;
    resolverProblemasSelecionados: (selecionados: ProblemaAuditoria[]) => Promise<boolean>;
    reabrirProblemasSelecionados: (selecionados: ProblemaAuditoria[]) => Promise<boolean>;
    useBackendAudit: boolean;
};
//# sourceMappingURL=useAuditoria.d.ts.map