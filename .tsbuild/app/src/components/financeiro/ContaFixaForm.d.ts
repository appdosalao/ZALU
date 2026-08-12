import { ContaFixa, NovaContaFixa, CategoriaFinanceira } from '@/types/contaFixa';
interface ContaFixaFormProps {
    conta?: ContaFixa;
    categorias: CategoriaFinanceira[];
    onSubmit: (data: NovaContaFixa) => void;
    onCancel: () => void;
    onCreateCategoria?: (nome: string, cor?: string) => Promise<void>;
}
export default function ContaFixaForm({ conta, categorias, onSubmit, onCancel, onCreateCategoria }: ContaFixaFormProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ContaFixaForm.d.ts.map