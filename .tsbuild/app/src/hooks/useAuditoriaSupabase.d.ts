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
export declare function useAuditoriaSupabase(): {
    executarAuditoria: () => Promise<RelatorioAuditoria>;
    exportarRelatorio: (formato: "csv" | "json") => Promise<void>;
};
//# sourceMappingURL=useAuditoriaSupabase.d.ts.map