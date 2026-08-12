import { Compra, NovaCompra } from '@/types/compra';
export declare function useSupabaseCompras(): {
    compras: Compra[];
    loading: boolean;
    createCompra: (compra: NovaCompra) => Promise<void>;
    registrarPagamento: (compraId: string, valorPago: number) => Promise<void>;
    recarregar: () => Promise<void>;
};
//# sourceMappingURL=useSupabaseCompras.d.ts.map