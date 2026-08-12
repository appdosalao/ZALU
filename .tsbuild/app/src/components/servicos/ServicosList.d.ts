import { Servico, ServicoFiltros } from '@/types/servico';
interface ServicosListProps {
    servicos: Servico[];
    filtros: ServicoFiltros;
    onFiltrosChange: (filtros: ServicoFiltros) => void;
    onEdit: (servico: Servico) => void;
    onDelete: (id: string) => void;
}
export default function ServicosList({ servicos, filtros, onFiltrosChange, onEdit, onDelete, }: ServicosListProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ServicosList.d.ts.map