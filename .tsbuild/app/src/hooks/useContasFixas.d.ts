export declare function useContasFixas(): {
    criarContaFixa: (conta: import("../types/contaFixa").NovaContaFixa) => Promise<{
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
    atualizarContaFixa: (id: string, updates: Partial<import("../types/contaFixa").ContaFixa>) => Promise<void>;
    removerContaFixa: (id: string) => Promise<void>;
    criarCategoria: (categoria: {
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
    recarregar: () => Promise<void>;
    estatisticas: {
        total: number;
        pagas: number;
        emAberto: number;
        valorTotal: number;
    };
    marcarComoPaga: (id: string) => Promise<void>;
    pagarContaFixa: (id: string) => Promise<void>;
    marcarComoEmAberto: (id: string) => Promise<void>;
    toggleAtiva: (id: string) => Promise<void>;
    getContasVencidas: () => import("../types/contaFixa").ContaFixa[];
    getContasAVencer: () => import("../types/contaFixa").ContaFixa[];
    contasFixas: import("../types/contaFixa").ContaFixa[];
    categorias: import("../types/contaFixa").CategoriaFinanceira[];
    loading: boolean;
    error: string;
    createContaFixa: (conta: import("../types/contaFixa").NovaContaFixa) => Promise<{
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
    updateContaFixa: (id: string, updates: Partial<import("../types/contaFixa").ContaFixa>) => Promise<void>;
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
//# sourceMappingURL=useContasFixas.d.ts.map