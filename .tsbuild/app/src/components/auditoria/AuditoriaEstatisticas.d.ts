interface EstatisticasProps {
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
}
export declare function AuditoriaEstatisticas({ estatisticas }: EstatisticasProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=AuditoriaEstatisticas.d.ts.map