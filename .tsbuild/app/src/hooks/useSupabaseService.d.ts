export declare const useSupabaseService: () => {
    loading: boolean;
    error: string;
    getServicos: () => Promise<{
        descricao: string | null;
        duracao: number | null;
        id: string | null;
        nome: string | null;
        valor: number | null;
    }[]>;
    getActiveDays: () => Promise<{
        dia_semana: number;
    }[]>;
    createAgendamentoOnline: (agendamentoData: any) => Promise<boolean>;
};
//# sourceMappingURL=useSupabaseService.d.ts.map