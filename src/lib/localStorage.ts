// Sistema centralizado de armazenamento local
export interface LocalStorageKeys {
  USUARIO: 'usuario';
  SERVICOS: 'servicos';
  CLIENTES: 'clientes';
  AGENDAMENTOS: 'agendamentos';
  CRONOGRAMAS: 'cronogramas';
  LANCAMENTOS: 'lancamentos';
  NOTIFICATION_SETTINGS: 'notification-settings';
  CONFIGURACOES: 'configuracoes';
  APP_THEME: 'app-theme';
  MINHA_AGENDA_TAB: 'minhaAgenda.tab';
  ONBOARDING_COMPLETED: 'onboarding-completed';
  SCHEDULED_NOTIF_PREFIX: 'scheduled-notifications-';
  NOTIFICATION_SHOWN_PREFIX: 'notification-shown-';
  SUBSCRIPTION_CHECK: 'subscription-check-timestamp';
  CUSTOM_SOUND_LIB: 'sound-library-urls';
  AUDIT_LOG: 'zalu-audit-log';
}

export const LOCAL_STORAGE_KEYS: LocalStorageKeys = {
  USUARIO: 'usuario',
  SERVICOS: 'servicos',
  CLIENTES: 'clientes',
  AGENDAMENTOS: 'agendamentos',
  CRONOGRAMAS: 'cronogramas',
  LANCAMENTOS: 'lancamentos',
  NOTIFICATION_SETTINGS: 'notification-settings',
  CONFIGURACOES: 'configuracoes',
  APP_THEME: 'app-theme',
  MINHA_AGENDA_TAB: 'minhaAgenda.tab',
  ONBOARDING_COMPLETED: 'onboarding-completed',
  SCHEDULED_NOTIF_PREFIX: 'scheduled-notifications-',
  NOTIFICATION_SHOWN_PREFIX: 'notification-shown-',
  SUBSCRIPTION_CHECK: 'subscription-check-timestamp',
  CUSTOM_SOUND_LIB: 'sound-library-urls',
  AUDIT_LOG: 'zalu-audit-log',
};

// Eventos customizados para sincronização entre abas/contextos
export const STORAGE_EVENTS = {
  SERVICO_ADDED: 'servico-added',
  CLIENTE_ADDED: 'cliente-added',
  AGENDAMENTO_ADDED: 'agendamento-added',
  DATA_UPDATED: 'data-updated',
} as const;

function hasWindow(): boolean {
  return typeof window !== 'undefined' && window.localStorage != null;
}

export function getString(key: string): string | null {
  try {
    if (!hasWindow()) return null;
    return window.localStorage.getItem(key);
  } catch (error) {
    console.error(`Erro ao ler ${key} do localStorage:`, error);
    return null;
  }
}

export function setString(key: string, value: string): void {
  try {
    if (!hasWindow()) return;
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Erro ao salvar ${key} no localStorage:`, error);
  }
}

export function removeItem(key: string): void {
  try {
    if (!hasWindow()) return;
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Erro ao remover ${key} do localStorage:`, error);
  }
}

export function getData<T = unknown>(key: string): T | null {
  try {
    const raw = getString(key);
    return raw != null ? (JSON.parse(raw) as T) : null;
  } catch (error) {
    console.error(`Erro ao fazer parse de ${key} do localStorage:`, error);
    return null;
  }
}

export function saveData<T>(key: string, data: T): void {
  try {
    setString(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Erro ao serializar ${key} no localStorage:`, error);
  }
}

export function getScheduledNotificationKey(id: string | number): string {
  return LOCAL_STORAGE_KEYS.SCHEDULED_NOTIF_PREFIX + String(id);
}

export function getNotificationShownKey(id: string | number): string {
  return LOCAL_STORAGE_KEYS.NOTIFICATION_SHOWN_PREFIX + String(id);
}

export const storage = {
  getString,
  setString,
  removeItem,
  getData,
  saveData,
  getScheduledNotificationKey,
  getNotificationShownKey,
};

// Utilitários para localStorage (classe original mantida para compatibilidade)
export class LocalStorageManager {
  static get<T>(key: keyof LocalStorageKeys): T[] {
    try {
      const data = getString(LOCAL_STORAGE_KEYS[key]);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Erro ao ler ${key} do localStorage:`, error);
      return [];
    }
  }

  static set<T>(key: keyof LocalStorageKeys, data: T[]): void {
    try {
      setString(LOCAL_STORAGE_KEYS[key], JSON.stringify(data));
      // Disparar evento customizado para sincronização
      if (hasWindow()) {
        window.dispatchEvent(new CustomEvent(STORAGE_EVENTS.DATA_UPDATED, {
          detail: { key, data }
        }));
      }
    } catch (error) {
      console.error(`Erro ao salvar ${key} no localStorage:`, error);
    }
  }

  static add<T>(key: keyof LocalStorageKeys, item: T): void {
    const items = this.get<T>(key);
    const newItems = [...items, item];
    this.set(key, newItems);

    // Disparar evento específico
    const eventType = this.getEventTypeForKey(key);
    if (eventType && hasWindow()) {
      window.dispatchEvent(new CustomEvent(eventType, { detail: item }));
    }
  }

  static update<T>(key: keyof LocalStorageKeys, id: string, updates: Partial<T>): void {
    const items = this.get<T>(key);
    const updatedItems = items.map((item: any) => {
      const itemId = this.getItemId(item, key);
      return itemId === id ? { ...item, ...updates } : item;
    });
    this.set(key, updatedItems);
  }

  static remove<T>(key: keyof LocalStorageKeys, id: string): void {
    const items = this.get<T>(key);
    const filteredItems = items.filter((item: any) => {
      const itemId = this.getItemId(item, key);
      return itemId !== id;
    });
    this.set(key, filteredItems);
  }

  // Método para obter ID do item baseado na chave
  private static getItemId(item: any, key: keyof LocalStorageKeys): string {
    switch (key) {
      case 'CRONOGRAMAS':
        return item.id_cronograma;
      default:
        return item.id;
    }
  }

  static clear(key: keyof LocalStorageKeys): void {
    removeItem(LOCAL_STORAGE_KEYS[key]);
    if (hasWindow()) {
      window.dispatchEvent(new CustomEvent(STORAGE_EVENTS.DATA_UPDATED, {
        detail: { key, data: [] }
      }));
    }
  }

  private static getEventTypeForKey(key: keyof LocalStorageKeys): string | null {
    switch (key) {
      case 'SERVICOS':
        return STORAGE_EVENTS.SERVICO_ADDED;
      case 'CLIENTES':
        return STORAGE_EVENTS.CLIENTE_ADDED;
      case 'AGENDAMENTOS':
        return STORAGE_EVENTS.AGENDAMENTO_ADDED;
      default:
        return null;
    }
  }

  // Método para sincronizar dados entre abas
  static setupCrossTabSync(): void {
    if (!hasWindow()) return;
    window.addEventListener('storage', (e) => {
      if (Object.values(LOCAL_STORAGE_KEYS).includes(e.key as any)) {
        window.dispatchEvent(new CustomEvent(STORAGE_EVENTS.DATA_UPDATED, {
          detail: { key: e.key, data: e.newValue ? JSON.parse(e.newValue) : [] }
        }));
      }
    });
  }
}
