import { Cliente } from "@/types/cliente";
interface ClientesListProps {
    clientes: Cliente[];
    onEdit: (cliente: Cliente) => Promise<boolean>;
    onDelete: (id: string) => void;
    onViewDetails: (cliente: Cliente) => void;
}
export default function ClientesList({ clientes, onEdit, onDelete, onViewDetails }: ClientesListProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ClientesList.d.ts.map