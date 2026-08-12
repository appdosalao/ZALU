interface ConfiguracaoHorario {
    id: string;
    dia_semana: number;
    ativo: boolean;
    horario_abertura: string;
    horario_fechamento: string;
    intervalo_inicio?: string;
    intervalo_fim?: string;
}
export declare const useHorariosTrabalho: (userId?: string) => {
    configuracoes: ConfiguracaoHorario[];
    loading: boolean;
    isDiaAtivo: (diaSemana: number) => boolean;
    isHorarioValido: (diaSemana: number, horario: string) => boolean;
    isAgendamentoValido: (data: string, horario: string, duracao?: number) => boolean;
    getHorariosDisponiveis: (diaSemana: number, duracaoServico?: number) => string[];
    refetch: () => Promise<void>;
};
export {};
//# sourceMappingURL=useHorariosTrabalho.d.ts.map