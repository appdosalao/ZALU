/**
 * Hook base genérico para operações CRUD com Supabase
 * Reduz duplicação de código entre hooks específicos
 */
export declare function useSupabaseBase<T>(tableName: string): {
    data: T[];
    setData: import("react").Dispatch<import("react").SetStateAction<T[]>>;
    loading: boolean;
    setLoading: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    error: string;
    setError: import("react").Dispatch<import("react").SetStateAction<string>>;
    loadData: (selectQuery?: string, orderBy?: {
        column: string;
        ascending?: boolean;
    }) => Promise<({
        error: true;
    } & "Received a generic string")[]>;
    createRecord: (record: Partial<T>, successMessage?: string) => Promise<false | import("node_modules/@supabase/postgrest-js/dist/cjs/select-query-parser/utils").SelectQueryError<"Invalid Relationships cannot infer result type"> | import("node_modules/@supabase/postgrest-js/dist/cjs/select-query-parser/utils").SelectQueryError<"Invalid RelationName cannot infer result type">>;
    updateRecord: (id: string, updates: Partial<T>, idColumn?: string, successMessage?: string) => Promise<boolean>;
    deleteRecord: (id: string, idColumn?: string, successMessage?: string) => Promise<boolean>;
    setupRealtimeSubscription: (callback: () => void, additionalTables?: string[]) => () => void;
};
//# sourceMappingURL=useSupabaseBase.d.ts.map