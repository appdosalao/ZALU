import type { RelatorioExportacao } from '@/types/relatorio';
import type { Lancamento } from '@/types/lancamento';
import type { ContaFixa } from '@/types/contaFixa';
import type { Agendamento } from '@/types/agendamento';
export declare function exportRelatorioJSON(relatorio: RelatorioExportacao): void;
export declare function exportLancamentosCSV(lancamentos: Lancamento[], filename?: string): void;
export declare function exportContasFixasCSV(contas: ContaFixa[], filename?: string): void;
export declare function exportAgendamentosCSV(agendamentos: Agendamento[], filename?: string): void;
export declare function exportRelatorioCSV(relatorio: RelatorioExportacao): void;
export declare function exportRelatorioPDF(relatorio: RelatorioExportacao, brand?: {
    salonName?: string;
    logoUrl?: string;
}): void;
export declare function exportDespesasUsoCSV(rows: Array<{
    data: string;
    categoria: string;
    valor: number;
    descricao: string;
}>, filename?: string): void;
export declare function exportDespesasUsoPDF(rows: Array<{
    data: string;
    categoria: string;
    valor: number;
    descricao: string;
}>, periodo: string, brand?: {
    salonName?: string;
    logoUrl?: string;
}): void;
export declare function exportVendasPorProdutoCSV(rows: Array<{
    produto: string;
    quantidade: number;
    valor_total: number;
}>, filename?: string): void;
export declare function exportVendasPorProdutoPDF(rows: Array<{
    produto: string;
    quantidade: number;
    valor_total: number;
}>, periodo: string, brand?: {
    salonName?: string;
    logoUrl?: string;
}): void;
export declare function exportMovimentacoesEstoqueCSV(rows: Array<{
    id: string;
    tipo: string;
    data: string;
    valor: number;
    descricao: string;
    status?: string;
    itens?: number;
}>, filename?: string): void;
export declare function exportMovimentacoesEstoquePDF(rows: Array<{
    id: string;
    tipo: string;
    data: string;
    valor: number;
    descricao: string;
    status?: string;
    itens?: number;
}>, periodo?: string, brand?: {
    salonName?: string;
    logoUrl?: string;
}): void;
//# sourceMappingURL=export.d.ts.map