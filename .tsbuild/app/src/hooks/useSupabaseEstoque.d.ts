import { MovimentacaoEstoque, NovaMovimentacao } from '@/types/estoque';
export declare function useSupabaseEstoque(): {
    movimentacoes: MovimentacaoEstoque[];
    loading: boolean;
    createMovimentacao: (movimentacao: NovaMovimentacao) => Promise<void>;
    recarregar: () => Promise<void>;
};
//# sourceMappingURL=useSupabaseEstoque.d.ts.map