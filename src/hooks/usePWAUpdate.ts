import { useState, useEffect, useCallback, useRef } from 'react';
import { registerSW } from 'virtual:pwa-register';

type PWAUpdateStatus = {
  needRefresh: boolean;
  updateServiceWorker: () => void;
  offlineReady: boolean;
};

export function usePWAUpdate(): PWAUpdateStatus {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const updateSWRef = useRef<(reloadPage?: boolean) => Promise<void>>();

  const handleNeedRefresh = useCallback(() => {
    setNeedRefresh(true);
  }, []);

  const handleOfflineReady = useCallback(() => {
    setOfflineReady(true);
  }, []);

  const updateServiceWorker = useCallback(() => {
    if (updateSWRef.current) {
      updateSWRef.current(true);
    }
  }, []);

  useEffect(() => {
    updateSWRef.current = registerSW({
      onNeedRefresh: handleNeedRefresh,
      onOfflineReady: handleOfflineReady,
    });
  }, [handleNeedRefresh, handleOfflineReady]);

  return {
    needRefresh,
    updateServiceWorker,
    offlineReady,
  };
}
