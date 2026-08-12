import { ContaFixa, CategoriaFinanceira } from '@/types/contaFixa';
interface ContasFixasListProps {
    contas: ContaFixa[];
    categorias: CategoriaFinanceira[];
    onEdit: (conta: ContaFixa) => void;
    onDelete: (id: string) => void;
    onPagar: (contaId: string, valor?: number) => void;
    onToggleAtiva: (contaId: string, ativa: boolean) => void;
}
export default function ContasFixasList({ contas, categorias, onEdit, onDelete, onPagar, onToggleAtiva }: ContasFixasListProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ContasFixasList.d.ts.map