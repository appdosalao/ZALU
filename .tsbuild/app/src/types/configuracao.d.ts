export interface HorarioTrabalho {
    inicio: string;
    termino: string;
}
export interface IntervaloTrabalho {
    inicio: string;
    termino: string;
    descricao?: string;
}
export interface DiasSemana {
    domingo: boolean;
    segunda: boolean;
    terca: boolean;
    quarta: boolean;
    quinta: boolean;
    sexta: boolean;
    sabado: boolean;
}
export interface ConfiguracaoHorarios {
    diasAtivos: DiasSemana;
    horarioExpediente: HorarioTrabalho;
    intervaloAlmoco: IntervaloTrabalho;
    intervalosPersonalizados: IntervaloTrabalho[];
}
export interface ConfiguracaoNotificacoes {
    push: {
        ativo: boolean;
        subscription?: string;
    };
    novosAgendamentos: {
        visual: boolean;
        sonoro: boolean;
        push: boolean;
        som: 'notification' | 'notification2' | 'notification3';
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
}
export interface ConfiguracaoBackup {
    backupAutomatico: boolean;
    emailBackup: string;
    diasSemanaBackup: number[];
    ultimoBackup?: string;
}
export interface Configuracoes {
    id: string;
    userId: string;
    horarios: ConfiguracaoHorarios;
    notificacoes: ConfiguracaoNotificacoes;
    backup: ConfiguracaoBackup;
    createdAt: string;
    updatedAt: string;
}
export declare const CONFIG_DEFAULT: Omit<Configuracoes, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
//# sourceMappingURL=configuracao.d.ts.map