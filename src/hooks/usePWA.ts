import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  hasUpdate: boolean;
}

interface PWAActions {
  installApp: () => Promise<boolean>;
  updateApp: () => void;
  dismissInstall: () => void;
}

export const usePWA = (): PWAState & PWAActions => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  const [hasUpdate, setHasUpdate] = useState(false);

  useEffect(() => {
    // Verificar se já está instalado
    const checkIfInstalled = () => {
      try {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        const isInWebAppiOS = (window.navigator as any).standalone === true;
        setIsInstalled(isStandalone || isInWebAppiOS);
      } catch (error) {
        console.warn('Erro ao verificar se está instalado:', error);
      }
    };

    checkIfInstalled();

    // Listener para prompt de instalação
    const handleBeforeInstallPrompt = (e: Event) => {
      try {
        e.preventDefault();
        const event = e as BeforeInstallPromptEvent;
        setInstallPrompt(event);
        setIsInstallable(true);
      } catch (error) {
        console.warn('Erro no handleBeforeInstallPrompt:', error);
      }
    };

    // Listener para quando o app é instalado
    const handleAppInstalled = () => {
      try {
        setIsInstalled(true);
        setIsInstallable(false);
        setInstallPrompt(null);
      } catch (error) {
        console.warn('Erro no handleAppInstalled:', error);
      }
    };

    // Registrar listeners
    try {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
    } catch (error) {
      console.warn('Erro ao registrar event listeners:', error);
    }

    // Service Worker - verificar atualizações (sem re-registrar)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => {
          console.log('Service Worker verificado no usePWA:', registration.scope);
          
          // Verificar atualizações periodicamente
          const checkForUpdates = () => {
            registration.update().catch((error) => {
              console.log('Erro ao verificar atualizações:', error);
            });
          };
          
          // Verificar imediatamente e depois a cada 30 minutos
          checkForUpdates();
          const updateInterval = setInterval(checkForUpdates, 30 * 60 * 1000);
          
          // Verificar atualizações
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              console.log('Novo service worker encontrado, instalando...');
              newWorker.addEventListener('statechange', () => {
                console.log('Service worker state:', newWorker.state);
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  try {
                    console.log('Nova versão disponível!');
                    setHasUpdate(true);
                  } catch (error) {
                    console.warn('Erro ao atualizar hasUpdate:', error);
                  }
                }
              });
            }
          });
          
          return () => clearInterval(updateInterval);
        })
        .catch((error) => {
          console.log('Erro ao acessar Service Worker:', error);
        });

      // Listener para mensagens do Service Worker
      try {
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
            try {
              setHasUpdate(true);
            } catch (error) {
              console.warn('Erro ao processar mensagem do Service Worker:', error);
            }
          }
        });
      } catch (error) {
        console.warn('Erro ao adicionar listener de mensagens:', error);
      }
    }

    return () => {
      try {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      } catch (error) {
        console.warn('Erro ao remover event listeners:', error);
      }
    };
  }, []);

  const installApp = async (): Promise<boolean> => {
    if (!installPrompt) return false;

    try {
      await installPrompt.prompt();
      const result = await installPrompt.userChoice;
      
      if (result.outcome === 'accepted') {
        setIsInstallable(false);
        setInstallPrompt(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao instalar o app:', error);
      return false;
    }
  };

  const updateApp = () => {
    try {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then((registration) => {
          if (registration && registration.waiting) {
            console.log('Atualizando service worker...');
            
            // Listen for when the new service worker becomes active
            const handleControllerChange = () => {
              console.log('Novo service worker ativo, recarregando página...');
              window.location.reload();
            };
            
            registration.addEventListener('controllerchange', handleControllerChange);
            
            // Send message to skip waiting
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          } else {
            console.log('Nenhuma atualização pendente encontrada');
            // Tente verificar se há atualizações
            if (registration) {
              registration.update().then(() => {
                console.log('Verificação de atualização iniciada');
              });
            }
          }
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar o app:', error);
    }
  };

  const dismissInstall = () => {
    try {
      setIsInstallable(false);
      setInstallPrompt(null);
    } catch (error) {
      console.error('Erro ao dispensar instalação:', error);
    }
  };

  return {
    isInstallable,
    isInstalled,
    isOffline,
    hasUpdate,
    installApp,
    updateApp,
    dismissInstall,
  };
};