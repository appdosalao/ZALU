import { ContaFixa } from "@/types/contaFixa";
interface ContasFixasListMobileProps {
    contas: ContaFixa[];
    onEdit: (conta: ContaFixa) => void;
    onDelete: (id: string) => void;
    onPagar: (id: string) => void;
    onToggleAtiva: (id: string, ativa: boolean) => void;
}
export declare function ContasFixasListMobile({ contas, onEdit, onDelete, onPagar, onToggleAtiva }: ContasFixasListMobileProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ContasFixasListMobile.d.ts.map