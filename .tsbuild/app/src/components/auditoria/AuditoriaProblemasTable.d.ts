interface ProblemaAuditoria {
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
interface AuditoriaProblemasTableProps {
    problemas: ProblemaAuditoria[];
    onResolverLote?: (selecionados: ProblemaAuditoria[]) => Promise<void> | void;
    unresolvedKeys?: Set<string>;
}
export declare function AuditoriaProblemasTable({ problemas, onResolverLote, unresolvedKeys }: AuditoriaProblemasTableProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=AuditoriaProblemasTable.d.ts.map