interface RelatorioHistorico {
    id: string;
    data_execucao: string;
    total_problemas: number;
    problemas_criticos: number;
    problemas_altos: number;
    problemas_medios: number;
    problemas_baixos: number;
    estatisticas?: any;
}
interface AuditoriaHistoricoProps {
    relatorios: RelatorioHistorico[];
    onCarregar: () => void;
    unresolvedCounts?: Record<string, number>;
}
export declare function AuditoriaHistorico({ relatorios, onCarregar, unresolvedCounts }: AuditoriaHistoricoProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=AuditoriaHistorico.d.ts.map