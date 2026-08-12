import { Lancamento, LancamentoFiltros } from "@/types/lancamento";
interface LancamentosListProps {
    lancamentos: Lancamento[];
    filtros: LancamentoFiltros;
    categorias: string[];
    onFiltrosChange: (filtros: LancamentoFiltros) => void;
    onEdit: (lancamento: Lancamento) => void;
    onDelete: (id: string) => void;
}
export default function LancamentosList({ lancamentos, filtros, categorias, onFiltrosChange, onEdit, onDelete, }: LancamentosListProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=LancamentosList.d.ts.map