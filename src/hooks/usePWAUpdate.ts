import { useState, useEffect, useCallback } from 'react';
import { registerSW } from 'virtual:pwa-register';

type PWAUpdateStatus = {
  needRefresh: boolean;
  updateServiceWorker: () => void;
  offlineReady: boolean;
};

export function usePWAUpdate(): PWAUpdateStatus {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [updateServiceWorker, setUpdateServiceWorker] = useState<() => void>(() => {});

  const handleNeedRefresh = useCallback(() => {
    setNeedRefresh(true);
  }, []);

  const handleOfflineReady = useCallback(() => {
    setOfflineReady(true);
  }, []);

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh: handleNeedRefresh,
      onOfflineReady: handleOfflineReady,
    });

    setUpdateServiceWorker(() => () => {
      updateSW(true);
    });

    return () => {
      // Cleanup if needed
    };
  }, [handleNeedRefresh, handleOfflineReady]);

  return {
    needRefresh,
    updateServiceWorker,
    offlineReady,
  };
}
