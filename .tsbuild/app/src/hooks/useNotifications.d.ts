interface NotificationSettings {
    soundEnabled: boolean;
    visualEnabled: boolean;
    autoHide: boolean;
    hideDelay: number;
    soundType: 'notification' | 'notification2' | 'notification3';
}
interface AgendamentoNotification {
    id: string;
    clienteNome: string;
    servicoNome: string;
    data: string;
    horario: string;
    origem: 'manual' | 'cronograma' | 'online';
    criadoEm: string;
    shown: boolean;
}
export declare const useNotifications: () => {
    notifications: AgendamentoNotification[];
    settings: NotificationSettings;
    addNotification: (agendamento: Omit<AgendamentoNotification, "shown">) => void;
    removeNotification: (id: string) => void;
    clearAllNotifications: () => void;
    updateSettings: (newSettings: Partial<NotificationSettings>) => void;
    checkForNewAgendamentos: (agendamentos: any[]) => void;
    requestNotificationPermission: () => Promise<boolean>;
    playNotificationSound: () => Promise<void>;
};
export {};
//# sourceMappingURL=useNotifications.d.ts.map