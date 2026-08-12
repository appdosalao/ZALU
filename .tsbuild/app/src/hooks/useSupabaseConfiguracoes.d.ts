export interface ConfiguracaoHorario {
    id: string;
    user_id: string;
    dia_semana: number;
    ativo: boolean;
    horario_abertura: string;
    horario_fechamento: string;
    intervalo_inicio?: string;
    intervalo_fim?: string;
    permite_agendamento_fora_horario?: boolean;
    tempo_minimo_antecedencia?: number;
    tempo_maximo_antecedencia?: number;
    created_at: string;
    updated_at: string;
}
export interface ConfiguracaoNotificacoes {
    id: string;
    user_id: string;
    notificacoes_push: boolean;
    notificacoes_email: boolean;
    notificacoes_som: boolean;
    som_personalizado?: string;
    lembrete_agendamento_minutos: number;
    lembrete_vencimento_dias: number;
    lembrete_contas_fixas_dias: number;
    notificar_cancelamentos: boolean;
    notificar_reagendamentos: boolean;
    notificar_pagamentos: boolean;
    notificar_novos_agendamentos: boolean;
    horario_inicio_notificacoes: string;
    horario_fim_notificacoes: string;
    created_at: string;
    updated_at: string;
}
export interface ConfiguracaoBackup {
    id: string;
    user_id: string;
    backup_automatico: boolean;
    frequencia_backup: 'diario' | 'semanal' | 'mensal';
    dia_backup?: number;
    hora_backup: string;
    email_backup?: string;
    incluir_clientes: boolean;
    incluir_agendamentos: boolean;
    incluir_servicos: boolean;
    incluir_financeiro: boolean;
    incluir_cronogramas: boolean;
    ultimo_backup?: string;
    proximo_backup?: string;
    created_at: string;
    updated_at: string;
}
export declare const useSupabaseConfiguracoes: () => {
    configuracaoHorarios: ConfiguracaoHorario[];
    configuracaoNotificacoes: ConfiguracaoNotificacoes;
    configuracaoBackup: ConfiguracaoBackup;
    loading: boolean;
    salvarHorario: (horario: Partial<ConfiguracaoHorario>) => Promise<{
        ativo: boolean;
        created_at: string;
        dia_semana: number;
        horario_abertura: string;
        horario_fechamento: string;
        id: string;
        intervalo_fim: string | null;
        intervalo_inicio: string | null;
        permite_agendamento_fora_horario: boolean | null;
        tempo_maximo_antecedencia: number | null;
        tempo_minimo_antecedencia: number | null;
        updated_at: string;
        user_id: string;
    }[]>;
    salvarNotificacoes: (notificacoes: Partial<ConfiguracaoNotificacoes>) => Promise<{
        created_at: string;
        horario_fim_notificacoes: string;
        horario_inicio_notificacoes: string;
        id: string;
        lembrete_agendamento_minutos: number;
        lembrete_contas_fixas_dias: number;
        lembrete_vencimento_dias: number;
        notificacoes_email: boolean;
        notificacoes_push: boolean;
        notificacoes_som: boolean;
        notificar_cancelamentos: boolean;
        notificar_novos_agendamentos: boolean;
        notificar_pagamentos: boolean;
        notificar_reagendamentos: boolean;
        som_personalizado: string | null;
        updated_at: string;
        user_id: string;
    }[]>;
    salvarBackup: (backup: Partial<ConfiguracaoBackup>) => Promise<{
        backup_automatico: boolean;
        created_at: string;
        dia_backup: number | null;
        email_backup: string | null;
        frequencia_backup: string;
        hora_backup: string;
        id: string;
        incluir_agendamentos: boolean;
        incluir_clientes: boolean;
        incluir_cronogramas: boolean;
        incluir_financeiro: boolean;
        incluir_servicos: boolean;
        proximo_backup: string | null;
        ultimo_backup: string | null;
        updated_at: string;
        user_id: string;
    }[]>;
    deletarHorario: (id: string) => Promise<void>;
    buscarHorariosPorDia: (diaSemana: number) => ConfiguracaoHorario;
    verificarDisponibilidade: (diaSemana: number, horario: string) => boolean;
    getHorariosDisponiveisDia: (diaSemana: number, duracaoServico?: number, intervaloMinutos?: number) => string[];
    refetch: () => void;
};
//# sourceMappingURL=useSupabaseConfiguracoes.d.ts.map