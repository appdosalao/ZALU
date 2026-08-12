import { Agendamento } from '@/types/agendamento';
import { Cliente } from '@/types/cliente';
interface ClienteHistoricoProps {
    cliente: Cliente;
    agendamentos: Agendamento[];
    onClose: () => void;
}
export declare function ClienteHistorico({ cliente, agendamentos, onClose }: ClienteHistoricoProps): import("react/jsx-runtime").JSX.Element;
interface BuscaClienteHistoricoProps {
    buscaTexto: string;
    clientes: Cliente[];
    agendamentos: Agendamento[];
    onClienteSelect: (cliente: Cliente | null) => void;
    clienteSelecionado: Cliente | null;
}
export declare function BuscaClienteHistorico({ buscaTexto, clientes, agendamentos, onClienteSelect, clienteSelecionado }: BuscaClienteHistoricoProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ClienteHistorico.d.ts.map