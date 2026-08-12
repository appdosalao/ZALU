interface AuditoriaSugestoesProps {
    sugestoes: string[];
    estatisticas: {
        clientesInativos: number;
        servicosNuncaUsados: number;
        totalAgendamentos: number;
        agendamentosCancelados: number;
    };
}
export declare function AuditoriaSugestoes({ sugestoes, estatisticas }: AuditoriaSugestoesProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=AuditoriaSugestoes.d.ts.map