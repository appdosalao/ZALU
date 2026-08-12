export declare const useConfiguracoes: () => {
    configuracoes: any;
    updateConfiguracoes: () => Promise<any>;
    isHorarioDisponivel: () => boolean;
    getHorariosDisponiveis: () => any[];
    exportarDados: () => Promise<void>;
    enviarBackupPorEmail: () => Promise<boolean>;
    configuracaoHorarios: import("./useSupabaseConfiguracoes").ConfiguracaoHorario[];
    configuracaoNotificacoes: import("./useSupabaseConfiguracoes").ConfiguracaoNotificacoes;
    configuracaoBackup: import("./useSupabaseConfiguracoes").ConfiguracaoBackup;
    loading: boolean;
    salvarHorario: (horario: Partial<import("./useSupabaseConfiguracoes").ConfiguracaoHorario>) => Promise<{
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
    salvarNotificacoes: (notificacoes: Partial<import("./useSupabaseConfiguracoes").ConfiguracaoNotificacoes>) => Promise<{
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
    salvarBackup: (backup: Partial<import("./useSupabaseConfiguracoes").ConfiguracaoBackup>) => Promise<{
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
    buscarHorariosPorDia: (diaSemana: number) => import("./useSupabaseConfiguracoes").ConfiguracaoHorario;
    verificarDisponibilidade: (diaSemana: number, horario: string) => boolean;
    getHorariosDisponiveisDia: (diaSemana: number, duracaoServico?: number, intervaloMinutos?: number) => string[];
    refetch: () => void;
} | {
    configuracoes: {
        id: string;
        userId: string;
        horarios: {
            diasAtivos: {
                domingo: boolean;
                segunda: boolean;
                terca: boolean;
                quarta: boolean;
                quinta: boolean;
                sexta: boolean;
                sabado: boolean;
            };
            horarioExpediente: {
                inicio: string;
                termino: string;
            };
            intervaloAlmoco: {
                inicio: string;
                termino: string;
            };
            intervalosPersonalizados: any[];
        };
        notificacoes: {
            push: {
                ativo: boolean;
            };
            novosAgendamentos: {
                visual: boolean;
                sonoro: boolean;
                push: boolean;
                som: "notification";
            };
            lembretesAgendamento: {
                ativo: boolean;
                antecedencia: number;
                push: boolean;
                sonoro: boolean;
            };
            retornoCronograma: {
                ativo: boolean;
                push: boolean;
                sonoro: boolean;
            };
            despesasFixas: {
                ativo: boolean;
                antecedencia: number;
                push: boolean;
                sonoro: boolean;
            };
            servicoFinalizado: {
                ativo: boolean;
                push: boolean;
                sonoro: boolean;
            };
            tempoAntecedencia: number;
        };
        backup: {
            backupAutomatico: boolean;
            emailBackup: string;
            diasSemanaBackup: number[];
            ultimoBackup: string;
        };
        createdAt: string;
        updatedAt: string;
    };
    updateConfiguracoes: (updates: any) => Promise<{
        id: string;
        userId: string;
        horarios: {
            diasAtivos: {
                domingo: boolean;
                segunda: boolean;
                terca: boolean;
                quarta: boolean;
                quinta: boolean;
                sexta: boolean;
                sabado: boolean;
            };
            horarioExpediente: {
                inicio: string;
                termino: string;
            };
            intervaloAlmoco: {
                inicio: string;
                termino: string;
            };
            intervalosPersonalizados: any[];
        };
        notificacoes: {
            push: {
                ativo: boolean;
            };
            novosAgendamentos: {
                visual: boolean;
                sonoro: boolean;
                push: boolean;
                som: "notification";
            };
            lembretesAgendamento: {
                ativo: boolean;
                antecedencia: number;
                push: boolean;
                sonoro: boolean;
            };
            retornoCronograma: {
                ativo: boolean;
                push: boolean;
                sonoro: boolean;
            };
            despesasFixas: {
                ativo: boolean;
                antecedencia: number;
                push: boolean;
                sonoro: boolean;
            };
            servicoFinalizado: {
                ativo: boolean;
                push: boolean;
                sonoro: boolean;
            };
            tempoAntecedencia: number;
        };
        backup: {
            backupAutomatico: boolean;
            emailBackup: string;
            diasSemanaBackup: number[];
            ultimoBackup: string;
        };
        createdAt: string;
        updatedAt: string;
    }>;
    isHorarioDisponivel: (diaSemana: number, horario: string) => boolean;
    getHorariosDisponiveis: (diaSemana: number, duracaoServico?: number, intervaloMinutos?: number) => string[];
    exportarDados: () => Promise<void>;
    enviarBackupPorEmail: (email: string) => Promise<boolean>;
    configuracaoHorarios: import("./useSupabaseConfiguracoes").ConfiguracaoHorario[];
    configuracaoNotificacoes: import("./useSupabaseConfiguracoes").ConfiguracaoNotificacoes;
    configuracaoBackup: import("./useSupabaseConfiguracoes").ConfiguracaoBackup;
    loading: boolean;
    salvarHorario: (horario: Partial<import("./useSupabaseConfiguracoes").ConfiguracaoHorario>) => Promise<{
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
    salvarNotificacoes: (notificacoes: Partial<import("./useSupabaseConfiguracoes").ConfiguracaoNotificacoes>) => Promise<{
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
    salvarBackup: (backup: Partial<import("./useSupabaseConfiguracoes").ConfiguracaoBackup>) => Promise<{
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
    buscarHorariosPorDia: (diaSemana: number) => import("./useSupabaseConfiguracoes").ConfiguracaoHorario;
    verificarDisponibilidade: (diaSemana: number, horario: string) => boolean;
    getHorariosDisponiveisDia: (diaSemana: number, duracaoServico?: number, intervaloMinutos?: number) => string[];
    refetch: () => void;
};
//# sourceMappingURL=useConfiguracoes.d.ts.map