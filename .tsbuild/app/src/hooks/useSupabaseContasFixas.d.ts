import { ContaFixa, NovaContaFixa, CategoriaFinanceira } from '@/types/contaFixa';
export declare const useSupabaseContasFixas: () => {
    contasFixas: ContaFixa[];
    categorias: CategoriaFinanceira[];
    loading: boolean;
    error: string;
    createContaFixa: (conta: NovaContaFixa) => Promise<{
        ativa: boolean;
        categoria: string;
        created_at: string;
        data_vencimento: number;
        frequencia: string;
        id: string;
        nome: string;
        observacoes: string | null;
        proximo_vencimento: string | null;
        repetir: boolean;
        status: string;
        updated_at: string;
        user_id: string;
        valor: number;
    }>;
    updateContaFixa: (id: string, updates: Partial<ContaFixa>) => Promise<void>;
    deleteContaFixa: (id: string) => Promise<void>;
    createCategoria: (categoria: {
        nome: string;
        tipo: "receita" | "despesa" | "investimento";
        cor?: string;
    }) => Promise<{
        cor: string | null;
        created_at: string;
        id: string;
        nome: string;
        tipo: string;
        updated_at: string;
        user_id: string;
    }>;
    loadContasFixas: () => Promise<void>;
    loadCategorias: () => Promise<void>;
};
//# sourceMappingURL=useSupabaseContasFixas.d.ts.map