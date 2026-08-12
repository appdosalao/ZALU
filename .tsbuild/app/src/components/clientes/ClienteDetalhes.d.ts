import { Cliente } from "@/types/cliente";
interface ClienteDetalhesProps {
    cliente: Cliente | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit: (cliente: Cliente) => Promise<boolean>;
}
export default function ClienteDetalhes({ cliente, open, onOpenChange, onEdit }: ClienteDetalhesProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ClienteDetalhes.d.ts.map