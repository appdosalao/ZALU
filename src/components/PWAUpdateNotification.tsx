import { useEffect, useRef, useState } from 'react';
import { Check, RefreshCw, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { usePWAUpdate } from '@/hooks/usePWAUpdate';

const UPDATE_NOTICE_KEY = 'zalu-pwa-update-notice';

function UpdateCard({
  updateServiceWorker,
  onDismiss,
}: {
  updateServiceWorker: () => Promise<void>;
  onDismiss: () => void;
}) {
  const [updating, setUpdating] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const swipeOffsetRef = useRef(0);
  const suppressClickRef = useRef(false);

  const handleUpdate = async () => {
    setUpdating(true);

    try {
      window.sessionStorage.setItem(UPDATE_NOTICE_KEY, 'true');
      await updateServiceWorker();
    } catch (error) {
      window.sessionStorage.removeItem(UPDATE_NOTICE_KEY);
      console.error('Erro ao atualizar o aplicativo:', error);
      setUpdating(false);
      toast.error('Não foi possível atualizar agora', {
        description: 'Verifique sua conexão e tente novamente.',
      });
    }
  };

  return (
    <div
      onClickCapture={(event) => {
        if (!suppressClickRef.current) return;
        event.preventDefault();
        event.stopPropagation();
        suppressClickRef.current = false;
      }}
      onTouchStart={(event) => {
        if (!updating) {
          touchStartX.current = event.touches[0]?.clientX ?? null;
          swipeOffsetRef.current = 0;
        }
      }}
      onTouchMove={(event) => {
        if (touchStartX.current === null || updating) return;
        const offset = event.touches[0].clientX - touchStartX.current;
        swipeOffsetRef.current = offset;
        setSwipeOffset(offset);
      }}
      onTouchEnd={() => {
        if (Math.abs(swipeOffsetRef.current) >= 90 && !updating) {
          suppressClickRef.current = true;
          window.setTimeout(() => {
            suppressClickRef.current = false;
          }, 700);
          onDismiss();
        }
        touchStartX.current = null;
        swipeOffsetRef.current = 0;
        setSwipeOffset(0);
      }}
      onTouchCancel={() => {
        touchStartX.current = null;
        swipeOffsetRef.current = 0;
        setSwipeOffset(0);
      }}
      style={{ transform: `translateX(${swipeOffset}px)` }}
      className={`pointer-events-auto w-[min(356px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-primary/15 bg-card text-card-foreground shadow-2xl shadow-primary/15 touch-pan-y ${
        swipeOffset === 0 ? 'transition-transform duration-200 ease-out' : ''
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3 p-4 sm:p-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-lilac-primary text-primary-foreground shadow-lg shadow-primary/20">
          {updating ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-bold tracking-tight">
                {updating ? 'Preparando atualização' : 'Novidades no ZALU'}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {updating
                  ? 'Estamos carregando a versão mais recente. Esta página será atualizada automaticamente.'
                  : 'Uma nova versão com melhorias e correções está pronta para você.'}
              </p>
            </div>

            {!updating && (
              <button
                type="button"
                onClick={onDismiss}
                aria-label="Fechar aviso de atualização"
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {!updating && (
            <>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                Seus links de agendamento continuam os mesmos.
              </p>
              <Button onClick={handleUpdate} className="mt-4 w-full gap-2 rounded-xl font-semibold">
                <RefreshCw className="h-4 w-4" />
                Atualizar agora
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function PWAUpdateNotification() {
  const { needRefresh, updateServiceWorker, offlineReady } = usePWAUpdate();
  const [updateDismissed, setUpdateDismissed] = useState(false);

  useEffect(() => {
    if (offlineReady) {
      toast.success('App pronto para uso offline!');
    }
  }, [offlineReady]);

  useEffect(() => {
    if (window.sessionStorage.getItem(UPDATE_NOTICE_KEY) !== 'true') return;

    window.sessionStorage.removeItem(UPDATE_NOTICE_KEY);
    toast.success('Sistema atualizado!', {
      description: 'As melhorias e correções já estão disponíveis. Seus links de agendamento continuam iguais.',
      duration: 7000,
      position: 'top-center',
    });
  }, []);

  return needRefresh && !updateDismissed ? (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[9999] flex justify-center px-4 pt-[env(safe-area-inset-top)]">
      <UpdateCard
        updateServiceWorker={updateServiceWorker}
        onDismiss={() => setUpdateDismissed(true)}
      />
    </div>
  ) : null;
}
