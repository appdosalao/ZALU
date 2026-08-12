export interface LocalStorageKeys {
    USUARIO: 'usuario';
    SERVICOS: 'servicos';
    CLIENTES: 'clientes';
    AGENDAMENTOS: 'agendamentos';
    CRONOGRAMAS: 'cronogramas';
    LANCAMENTOS: 'lancamentos';
    NOTIFICATION_SETTINGS: 'notification-settings';
    CONFIGURACOES: 'configuracoes';
}
export declare const LOCAL_STORAGE_KEYS: LocalStorageKeys;
export declare const STORAGE_EVENTS: {
    readonly SERVICO_ADDED: "servico-added";
    readonly CLIENTE_ADDED: "cliente-added";
    readonly AGENDAMENTO_ADDED: "agendamento-added";
    readonly DATA_UPDATED: "data-updated";
};
export declare class LocalStorageManager {
    static get<T>(key: keyof LocalStorageKeys): T[];
    static set<T>(key: keyof LocalStorageKeys, data: T[]): void;
    static add<T>(key: keyof LocalStorageKeys, item: T): void;
    static update<T>(key: keyof LocalStorageKeys, id: string, updates: Partial<T>): void;
    static remove<T>(key: keyof LocalStorageKeys, id: string): void;
    private static getItemId;
    static clear(key: keyof LocalStorageKeys): void;
    private static getEventTypeForKey;
    static setupCrossTabSync(): void;
}
//# sourceMappingURL=localStorage.d.ts.map