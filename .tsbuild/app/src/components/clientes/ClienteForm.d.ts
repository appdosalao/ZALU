import type { ReactNode } from "react";
import { Cliente, ClienteFormData } from "@/types/cliente";
interface ClienteFormProps {
    cliente?: Cliente;
    onSubmit: (data: ClienteFormData) => Promise<boolean>;
    trigger?: ReactNode;
}
export default function ClienteForm({ cliente, onSubmit, trigger }: ClienteFormProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ClienteForm.d.ts.map