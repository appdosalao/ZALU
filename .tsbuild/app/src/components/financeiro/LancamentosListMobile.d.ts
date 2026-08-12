import { Lancamento } from "@/types/lancamento";
interface LancamentosListMobileProps {
    lancamentos: Lancamento[];
    onEdit: (lancamento: Lancamento) => void;
    onDelete: (id: string) => void;
}
export declare function LancamentosListMobile({ lancamentos, onEdit, onDelete }: LancamentosListMobileProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=LancamentosListMobile.d.ts.map