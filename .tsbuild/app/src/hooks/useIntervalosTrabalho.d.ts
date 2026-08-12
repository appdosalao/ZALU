export interface IntervaloTrabalho {
    id: string;
    user_id: string;
    dia_semana: number;
    hora_inicio: string;
    hora_fim: string;
    descricao?: string;
    ativo: boolean;
    created_at: string;
    updated_at: string;
}
export declare const useIntervalosTrabalho: () => {
    intervalos: IntervaloTrabalho[];
    loading: boolean;
    criarIntervalo: (intervalo: Omit<IntervaloTrabalho, "id" | "user_id" | "created_at" | "updated_at">) => Promise<{
        ativo: boolean;
        created_at: string;
        descricao: string | null;
        dia_semana: number;
        hora_fim: string;
        hora_inicio: string;
        id: string;
        updated_at: string;
        user_id: string;
    }>;
    atualizarIntervalo: (id: string, intervalo: Partial<IntervaloTrabalho>) => Promise<{
        ativo: boolean;
        created_at: string;
        descricao: string | null;
        dia_semana: number;
        hora_fim: string;
        hora_inicio: string;
        id: string;
        updated_at: string;
        user_id: string;
    }>;
    deletarIntervalo: (id: string) => Promise<void>;
    buscarIntervalosPorDia: (diaSemana: number) => IntervaloTrabalho[];
    verificarSeEstaEmIntervalo: (diaSemana: number, horario: string) => boolean;
    refetch: () => Promise<void>;
};
//# sourceMappingURL=useIntervalosTrabalho.d.ts.map