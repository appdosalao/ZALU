import { Produto, NovoProduto } from '@/types/produto';
export declare function useSupabaseProdutos(): {
    produtos: Produto[];
    loading: boolean;
    erro: string;
    createProduto: (produto: NovoProduto) => Promise<void>;
    updateProduto: (id: string, produto: Partial<NovoProduto>) => Promise<void>;
    deleteProduto: (id: string) => Promise<void>;
    uploadImagem: (file: File) => Promise<string>;
    movimentarEstoque: (params: {
        produto_id: string;
        tipo: "entrada" | "saida" | "ajuste" | "perda";
        quantidade: number;
        motivo?: string;
        valor_unitario?: number;
    }) => Promise<boolean>;
    recarregar: () => Promise<void>;
};
//# sourceMappingURL=useSupabaseProdutos.d.ts.map