import { VendaProduto, NovaVenda } from '@/types/venda';
export declare function useSupabaseVendas(): {
    vendas: VendaProduto[];
    loading: boolean;
    createVenda: (venda: NovaVenda) => Promise<void>;
    recarregar: () => Promise<void>;
};
//# sourceMappingURL=useSupabaseVendas.d.ts.map