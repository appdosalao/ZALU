import { Fornecedor, NovoFornecedor } from '@/types/fornecedor';
export declare function useSupabaseFornecedores(): {
    fornecedores: Fornecedor[];
    loading: boolean;
    createFornecedor: (fornecedor: NovoFornecedor) => Promise<void>;
    updateFornecedor: (id: string, fornecedor: Partial<NovoFornecedor>) => Promise<void>;
    deleteFornecedor: (id: string) => Promise<void>;
    recarregar: () => Promise<void>;
};
//# sourceMappingURL=useSupabaseFornecedores.d.ts.map