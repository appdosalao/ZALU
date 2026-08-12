interface ConfiguracaoHorarioPublica {
    id: string;
    dia_semana: number;
    ativo: boolean;
    horario_abertura: string;
    horario_fechamento: string;
    intervalo_inicio?: string;
    intervalo_fim?: string;
}
export declare const useHorariosTrabalhoPublic: (userId?: string) => {
    configuracoes: ConfiguracaoHorarioPublica[];
    loading: boolean;
    isDiaAtivo: (diaSemana: number) => boolean;
    refetch: () => Promise<void>;
};
export {};
//# sourceMappingURL=useHorariosTrabalhoPublic.d.ts.map