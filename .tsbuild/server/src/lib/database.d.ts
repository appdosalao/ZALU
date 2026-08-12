export declare class LocalDatabase {
    static getInstance(): LocalDatabase;
    getClientes(...args: any[]): never[];
    getServicos(...args: any[]): never[];
    getAgendamentos(...args: any[]): never[];
    getCronogramas(...args: any[]): never[];
    getLancamentos(...args: any[]): never[];
}
export declare const db: {
    getContasFixas: (...args: any[]) => never[];
    getCategoriasFinanceiras: (...args: any[]) => never[];
    createContaFixa: (...args: any[]) => Promise<{
        id: string;
        success: boolean;
    }>;
    updateContaFixa: (...args: any[]) => Promise<{
        id: string;
        success: boolean;
    }>;
    deleteContaFixa: (...args: any[]) => Promise<boolean>;
    pagarContaFixa: (...args: any[]) => Promise<boolean>;
    createCategoriaFinanceira: (...args: any[]) => Promise<{
        id: string;
        success: boolean;
    }>;
    getContasAPagar: (...args: any[]) => {
        totalValue: number;
        items: never[];
    };
};
//# sourceMappingURL=database.d.ts.map