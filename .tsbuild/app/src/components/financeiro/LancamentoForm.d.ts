import { Lancamento, NovoLancamento } from "@/types/lancamento";
interface LancamentoFormProps {
    lancamento?: Lancamento;
    categorias: string[];
    onSubmit: (data: NovoLancamento) => Promise<boolean>;
    onCancel: () => void;
}
export default function LancamentoForm({ lancamento, categorias, onSubmit, onCancel, }: LancamentoFormProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=LancamentoForm.d.ts.map