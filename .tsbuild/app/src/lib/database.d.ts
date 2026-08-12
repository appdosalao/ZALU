export declare class LocalDatabase {
    static getInstance(): LocalDatabase;
    getClientes(...args: any[]): any[];
    getServicos(...args: any[]): any[];
    getAgendamentos(...args: any[]): any[];
    getCronogramas(...args: any[]): any[];
    getLancamentos(...args: any[]): any[];
}
export declare const db: {
    getContasFixas: (...args: any[]) => any[];
    getCategoriasFinanceiras: (...args: any[]) => any[];
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
        items: any[];
    };
};
//# sourceMappingURL=database.d.ts.map