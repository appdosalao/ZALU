import { CategoriasProduto, NovaCategoria } from '@/types/categoria';
export declare function useSupabaseCategorias(): {
    categorias: CategoriasProduto[];
    loading: boolean;
    createCategoria: (categoria: NovaCategoria) => Promise<void>;
    updateCategoria: (id: string, categoria: Partial<NovaCategoria>) => Promise<void>;
    deleteCategoria: (id: string) => Promise<void>;
    recarregar: () => Promise<void>;
};
//# sourceMappingURL=useSupabaseCategorias.d.ts.map