/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bell, X, Calendar, User, Scissors, Clock, ExternalLink, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import { AppLogo } from '@/components/branding/AppLogo';
import { Separator } from '@/components/ui/separator';

export function NotificacaoAgendamento() {
  const { notifications, removeNotification, clearAllNotifications } = useNotifications();
  const navigateRouter = useNavigate();

  const navigate = (path: string) => {
    navigateRouter(path);
  };

  const handleNotificationClick = (notificacao: any) => {
    navigate(`/minha-agenda?data=${notificacao.data}`);
    removeNotification(notificacao.id);
  };

  const getOrigemBadge = (origem: string) => {
    const badges = {
      online: { text: 'Online', class: 'bg-success/10 text-success border-success/20' },
      cronograma: { text: 'Automático', class: 'bg-info/10 text-info border-info/20' },
      manual: { text: 'Manual', class: 'bg-muted text-muted-foreground border-border' },
    };
    return badges[origem as keyof typeof badges] || badges.manual;
  };

  const formatData = (data: string) => {
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const handleVerAgendamentos = () => {
    navigate('/agendamentos');
    clearAllNotifications();
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-[380px] animate-in slide-in-from-top-4 fade-in zoom-in-95 duration-500">
      <div className="overflow-hidden rounded-[1.75rem] border-2 border-primary/10 bg-card/95 backdrop-blur-xl shadow-elegant">
        <div className="bg-gradient-to-br from-primary via-primary to-lilac-primary p-[1.5px]">
          <div className="rounded-[1.65rem] bg-card overflow-hidden">
            <div className="relative bg-gradient-to-br from-primary/[0.08] via-lilac-primary/[0.08] to-transparent px-4 py-3.5 border-b border-primary/10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
              <div className="relative flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 rounded-2xl bg-gradient-to-br from-primary to-lilac-primary flex items-center justify-center shadow-lg rotate-3 shrink-0">
                    <Bell className="h-5 w-5 text-primary-foreground animate-pulse" />
                    <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-success text-success-foreground text-[10px] font-black flex items-center justify-center shadow-md">
                      {notifications.length}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-black tracking-tight leading-none">
                        {notifications.length === 1 ? 'Novo Agendamento!' : 'Novos Agendamentos!'}
                      </h4>
                      <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
                    </div>
                    <p className="text-[11px] font-semibold tracking-wide uppercase text-muted-foreground/80 mt-1">
                      {notifications.length} {notifications.length === 1 ? 'recebido agora' : 'recebidos agora'} • ZALU
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearAllNotifications}
                  className="h-8 w-8 rounded-xl bg-muted/50 hover:bg-muted shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-2.5 space-y-2.5 max-h-[52vh] overflow-y-auto custom-scrollbar bg-gradient-to-b from-transparent to-muted/20">
              {notifications.map((notificacao) => {
                const origemBadge = getOrigemBadge(notificacao.origem);
                return (
                  <Card
                    key={notificacao.id}
                    className="group relative overflow-hidden rounded-2xl border-2 border-primary/10 bg-gradient-to-br from-card via-card to-secondary/30 hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer card-3d"
                    onClick={() => handleNotificationClick(notificacao)}
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-lilac-primary opacity-80 group-hover:opacity-100 transition-opacity" />
                    <CardContent className="p-3.5 pl-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-2.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="h-7 w-7 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                              <User className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <span className="text-sm font-bold tracking-tight truncate">{notificacao.clienteNome}</span>
                            <Badge variant="outline" className={`text-[10px] font-black tracking-wide uppercase px-1.5 py-0 rounded-full border ${origemBadge.class}`}>
                              {origemBadge.text}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <div className="h-6 w-6 rounded-lg bg-lilac-primary/10 flex items-center justify-center shrink-0">
                              <Scissors className="h-3 w-3 text-lilac-primary" />
                            </div>
                            <span className="font-medium text-muted-foreground truncate">{notificacao.servicoNome}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-1">
                              <Calendar className="h-3 w-3 text-primary" />
                              <span className="text-xs font-bold">{formatData(notificacao.data)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 rounded-full bg-lilac-light/20 px-2 py-1">
                              <Clock className="h-3 w-3 text-lilac-primary" />
                              <span className="text-xs font-bold">{notificacao.horario.slice(0, 5)}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notificacao.id);
                          }}
                          className="h-7 w-7 rounded-xl bg-muted/60 hover:bg-destructive/10 hover:text-destructive shrink-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Separator className="bg-primary/10" />

            <div className="p-2.5 flex gap-2 bg-muted/30">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-9 rounded-xl border-primary/15 bg-card hover:bg-primary/5 font-bold text-xs gap-1.5"
                onClick={handleVerAgendamentos}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Ver Agenda
              </Button>
              <Button
                size="sm"
                className="flex-1 h-9 rounded-xl bg-gradient-to-br from-primary to-lilac-primary hover:from-primary/90 hover:to-lilac-primary/90 font-black text-xs gap-1.5 shadow-md"
                onClick={clearAllNotifications}
              >
                <Check className="h-3.5 w-3.5" />
                Visto
              </Button>
            </div>

            <div className="px-3 pb-2 flex items-center justify-center gap-1.5">
              <AppLogo size={14} rounded="full" className="border-primary/20" />
              <span className="text-[10px] font-black tracking-[0.12em] uppercase text-muted-foreground/60">ZALU • Seu salão em ordem</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
