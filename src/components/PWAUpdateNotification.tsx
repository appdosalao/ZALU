import { useEffect } from 'react';
import { toast } from 'sonner';
import { usePWAUpdate } from '@/hooks/usePWAUpdate';

export function PWAUpdateNotification() {
  const { needRefresh, updateServiceWorker, offlineReady } = usePWAUpdate();

  useEffect(() => {
    if (needRefresh) {
      toast(
        'Nova versão do app disponível!',
        {
          action: {
            label: 'Atualizar',
            onClick: () => {
              updateServiceWorker();
              toast.success('Atualizando...');
            },
          },
          duration: Infinity,
          position: 'top-center',
        }
      );
    }
  }, [needRefresh, updateServiceWorker]);

  useEffect(() => {
    if (offlineReady) {
      toast.success('App pronto para uso offline!');
    }
  }, [offlineReady]);

  return null;
}
