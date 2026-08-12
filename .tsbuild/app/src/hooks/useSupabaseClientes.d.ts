import { Cliente } from '@/types/cliente';
export declare function useSupabaseClientes(): {
    loading: boolean;
    clientes: Cliente[];
    criarCliente: (clienteData: any) => Promise<boolean>;
    atualizarCliente: (id: string, updates: any) => Promise<boolean>;
    excluirCliente: (id: string) => Promise<boolean>;
    obterClienteComEstatisticas: (id: string) => Cliente;
    recarregar: () => Promise<void>;
    carregarEstatisticasCliente: (clienteId: string) => Promise<{
        historicoServicos: {
            id: string;
            data: Date;
            servico: string;
            valor: number;
        }[];
        servicoFrequente: any;
        ultimaVisita: string;
    }>;
};
//# sourceMappingURL=useSupabaseClientes.d.ts.map