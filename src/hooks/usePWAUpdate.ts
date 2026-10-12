import { useState, useEffect, useCallback, useRef } from 'react';
import { registerSW } from 'virtual:pwa-register';

type PWAUpdateStatus = {
  needRefresh: boolean;
  updateServiceWorker: () => Promise<void>;
  offlineReady: boolean;
};

export function usePWAUpdate(): PWAUpdateStatus {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const updateSWRef = useRef<(reloadPage?: boolean) => Promise<void>>();
  const registrationStartedRef = useRef(false);
  const updateCheckIntervalRef = useRef<number>();
  const updateCheckHandlerRef = useRef<(() => void) | undefined>();

  const handleNeedRefresh = useCallback(() => {
    setNeedRefresh(true);
  }, []);

  const handleOfflineReady = useCallback(() => {
    setOfflineReady(true);
  }, []);

  const updateServiceWorker = useCallback(async () => {
    if (!updateSWRef.current) {
      throw new Error('O serviço de atualização ainda não está pronto.');
    }

    await updateSWRef.current(true);
  }, []);

  useEffect(() => {
    if (registrationStartedRef.current) return;
    registrationStartedRef.current = true;

    updateSWRef.current = registerSW({
      onNeedRefresh: handleNeedRefresh,
      onOfflineReady: handleOfflineReady,
      onRegistered: (registration) => {
        if (!registration) return;

        const checkForUpdates = () => {
          if (document.visibilityState !== 'visible') return;

          void registration.update().catch((error: unknown) => {
            console.error('Erro ao verificar atualizações do aplicativo:', error);
          });
        };

        updateCheckHandlerRef.current = checkForUpdates;
        document.addEventListener('visibilitychange', checkForUpdates);
        updateCheckIntervalRef.current = window.setInterval(checkForUpdates, 60_000);
      },
      onRegisterError: (error) => {
        console.error('Erro ao registrar o service worker:', error);
      },
    });

    return () => {
      if (updateCheckIntervalRef.current !== undefined) {
        window.clearInterval(updateCheckIntervalRef.current);
        updateCheckIntervalRef.current = undefined;
      }

      if (updateCheckHandlerRef.current) {
        document.removeEventListener('visibilitychange', updateCheckHandlerRef.current);
        updateCheckHandlerRef.current = undefined;
      }
    };
  }, [handleNeedRefresh, handleOfflineReady]);

  return {
    needRefresh,
    updateServiceWorker,
    offlineReady,
  };
}
