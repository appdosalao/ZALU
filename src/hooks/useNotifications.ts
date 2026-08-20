import { useState, useEffect, useRef, useCallback } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useSupabaseConfiguracoes } from '@/hooks/useSupabaseConfiguracoes';
import { toast } from 'sonner';
import { storage, LOCAL_STORAGE_KEYS, getNotificationShownKey } from '@/lib/localStorage';

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

const DEFAULT_SETTINGS: NotificationSettings = {
  soundEnabled: true,
  visualEnabled: true,
  autoHide: true,
  hideDelay: 10000,
  soundType: 'notification',
};

const DEFAULT_SOUND_FILES: Record<NotificationSettings['soundType'], string> = {
  notification: 'Mensagem de Texto 1.mp3',
  notification2: 'Mensagem de Texto 2.mp3',
  notification3: 'Mensagem de Texto 3.mp3',
};

export const useNotifications = () => {
  const { usuario } = useSupabaseAuth();
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const saved = storage.getData<NotificationSettings>(LOCAL_STORAGE_KEYS.NOTIFICATION_SETTINGS);
    if (saved) {
      return {
        ...DEFAULT_SETTINGS,
        ...saved,
      };
    }
    return DEFAULT_SETTINGS;
  });

  const [notifications, setNotifications] = useState<AgendamentoNotification[]>([]);
  const [lastChecked, setLastChecked] = useState<string>(new Date().toISOString());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [shownNotifications, setShownNotifications] = useState<Set<string>>(() => {
    const saved = storage.getData<string[]>(getNotificationShownKey(usuario?.id || 'guest'));
    return saved ? new Set(saved) : new Set();
  });

  useEffect(() => {
    storage.saveData(getNotificationShownKey(usuario?.id || 'guest'), [...shownNotifications]);
  }, [shownNotifications, usuario]);

  const { configuracaoNotificacoes } = useSupabaseConfiguracoes();

  const buildSoundUrl = useCallback((filename: string) => {
    return `/sounds/${encodeURIComponent(filename)}`;
  }, []);

  useEffect(() => {
    if (settings.soundEnabled) {
      const custom = configuracaoNotificacoes?.som_personalizado;
      const soundType = settings.soundType || 'notification';
      const filename = custom || DEFAULT_SOUND_FILES[soundType];

      const nextSrc = buildSoundUrl(filename);
      const audio = audioRef.current ?? new Audio();
      audio.src = nextSrc;
      audio.volume = 0.5;
      audio.preload = 'none';
      audioRef.current = audio;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, [buildSoundUrl, settings.soundEnabled, settings.soundType, configuracaoNotificacoes?.som_personalizado]);

  useEffect(() => {
    storage.saveData(LOCAL_STORAGE_KEYS.NOTIFICATION_SETTINGS, settings);
  }, [settings]);

  const playNotificationSound = useCallback(async () => {
    if (!settings.soundEnabled) return;

    const custom = configuracaoNotificacoes?.som_personalizado;
    const soundType = settings.soundType || 'notification';
    const filename = custom || DEFAULT_SOUND_FILES[soundType];
    const src = buildSoundUrl(filename);

    try {
      const audio = audioRef.current ?? new Audio();
      if (audio.src !== src) {
        audio.src = src;
      }
      audio.volume = 0.5;
      audio.preload = 'none';
      audio.currentTime = 0;
      audioRef.current = audio;
      await audio.play();
    } catch {}
  }, [buildSoundUrl, configuracaoNotificacoes?.som_personalizado, settings.soundEnabled, settings.soundType]);

  const addNotification = useCallback((agendamento: Omit<AgendamentoNotification, 'shown'>) => {
    if (!usuario || !settings.visualEnabled) return;

    if (shownNotifications.has(agendamento.id)) return;

    const newNotification = { ...agendamento, shown: false };
    setNotifications(prev => [newNotification, ...prev.slice(0, 2)]);
    setShownNotifications(prev => new Set([...prev, agendamento.id]));

    playNotificationSound();

    toast.success(`Novo Agendamento! ${agendamento.clienteNome} - ${agendamento.servicoNome}`);

    if (settings.autoHide) {
      setTimeout(() => {
        removeNotification(agendamento.id);
      }, settings.hideDelay);
    }
  }, [usuario, settings, playNotificationSound]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const checkForNewAgendamentos = useCallback((agendamentos: any[]) => {
    if (!usuario) return;

    const newAgendamentos = agendamentos.filter(agendamento => {
      if (agendamento.userId !== usuario.id) return false;

      const criadoEm = new Date(agendamento.createdAt);
      const ultimaVerificacao = new Date(lastChecked);

      return criadoEm > ultimaVerificacao && !shownNotifications.has(agendamento.id);
    });

    if (newAgendamentos.length > 0) {
      newAgendamentos.forEach(agendamento => {
        const origem = agendamento.origem || 'manual';

        addNotification({
          id: agendamento.id,
          clienteNome: agendamento.clienteNome,
          servicoNome: agendamento.servicoNome,
          data: agendamento.data,
          horario: agendamento.hora,
          origem: origem,
          criadoEm: agendamento.createdAt,
        });
      });

      setLastChecked(new Date().toISOString());
    }
  }, [usuario, lastChecked, addNotification]);

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  return {
    notifications,
    settings,
    addNotification,
    removeNotification,
    clearAllNotifications,
    updateSettings,
    checkForNewAgendamentos,
    requestNotificationPermission,
    playNotificationSound,
  };
};
