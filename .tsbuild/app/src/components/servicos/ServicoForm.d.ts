import { Servico, NovoServico } from '@/types/servico';
interface ServicoFormProps {
    servico?: Servico;
    onSubmit: (data: NovoServico) => void;
    onCancel: () => void;
}
export default function ServicoForm({ servico, onSubmit, onCancel, }: ServicoFormProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ServicoForm.d.ts.map