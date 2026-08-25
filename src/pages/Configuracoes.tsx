import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ConfiguracaoHorarios } from '@/components/configuracoes/ConfiguracaoHorarios';
import { ConfiguracaoNotificacoesAvancadas } from '@/components/configuracoes/ConfiguracaoNotificacoesAvancadas';
import { ConfiguracaoBackup } from '@/components/configuracoes/ConfiguracaoBackup';
import { ConfiguracaoAgendamentoOnline } from '@/components/configuracoes/ConfiguracaoAgendamentoOnline';
import { ConfiguracaoConta } from '@/components/configuracoes/ConfiguracaoConta';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, Bell, Calendar, Crown, CreditCard, Download, Lock, RefreshCw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { usePaidAccess } from '@/hooks/usePaidAccess';
import { toast } from 'sonner';

export default function Configuracoes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get('tab');
  const initialTab = (requestedTab && requestedTab !== 'assinatura') ? requestedTab : 'horarios';
  const [activeTab, setActiveTab] = useState(initialTab);
  const navigate = useNavigate();
  const { usuario, isLoading: authLoading, refreshProfile, isAuthenticated } = useSupabaseAuth();
  const { isPaid, isLoading: paidLoading, refetch } = usePaidAccess();
  const [statusLoading, setStatusLoading] = useState(false);

  const isLoading = authLoading || paidLoading;

  const trialStart = typeof usuario?.trial_start_date === 'string' ? new Date(usuario.trial_start_date) : null;
  const trialStartMs = trialStart ? trialStart.getTime() : null;
  const trialEndMs = typeof trialStartMs === 'number' && Number.isFinite(trialStartMs) ? trialStartMs + 7 * 24 * 60 * 60 * 1000 : null;
  const nowMs = Date.now();
  const trialValid =
    usuario?.subscription_status === 'trial' &&
    typeof trialStartMs === 'number' &&
    Number.isFinite(trialStartMs) &&
    nowMs < trialStartMs + 7 * 24 * 60 * 60 * 1000;
  const trialRemainingDays =
    typeof trialEndMs === 'number' && Number.isFinite(trialEndMs)
      ? Math.max(0, Math.ceil((trialEndMs - nowMs) / (1000 * 60 * 60 * 24)))
      : null;
  const trialProgress =
    typeof trialStartMs === 'number' && Number.isFinite(trialStartMs) && typeof trialEndMs === 'number' && Number.isFinite(trialEndMs)
      ? Math.min(100, Math.max(0, Math.round(((nowMs - trialStartMs) / (trialEndMs - trialStartMs)) * 100)))
      : null;

  const formatDate = (value: string | Date | null | undefined) => {
    if (!value) return '—';
    const d = value instanceof Date ? value : new Date(value);
    if (!Number.isFinite(d.getTime())) return '—';
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(d);
  };

  const statusLabel = (() => {
    if (isPaid) return 'Assinatura ativa';
    if (trialValid) return `Teste grátis ativo — ${trialRemainingDays ?? 0} dia(s) restante(s)`;
    if (usuario?.subscription_status === 'trial') return 'Teste grátis expirado — acesso pendente';
    return 'Acesso pendente';
  })();

  const planLabel = (() => {
    if (isPaid) return usuario?.plan_type === 'vitalicio' ? 'Anual (Vitalício)' : 'Profissional';
    return 'Teste grátis (7 dias)';
  })();
  useEffect(() => {
    const tab = searchParams.get('tab');
    const targetTab = (tab && tab !== 'assinatura') ? tab : 'horarios';
    if (targetTab !== activeTab) {
      setActiveTab(targetTab);
    }
  }, [searchParams]);

  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  return (
    <div className="container-responsive p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="space-y-1 sm:space-y-2">
        <h1 className="text-xl sm:text-3xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6 sm:h-8 sm:w-8" />
          <span>Configurações</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Configure os horários de atendimento, agendamento online, notificações e backup do sistema
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="flex md:grid md:grid-cols-6 gap-1 p-1 w-full bg-muted rounded-lg">
            <TabsTrigger value="horarios" className="flex items-center gap-2 min-h-[44px] flex-1">
              <Clock className="h-4 w-4" />
              Horários
            </TabsTrigger>
            <TabsTrigger value="agendamento-online" className="flex items-center gap-2 min-h-[44px] flex-1">
              <Calendar className="h-4 w-4" />
              Agend. Online
            </TabsTrigger>
            <TabsTrigger value="notificacoes" className="flex items-center gap-2 min-h-[44px] flex-1">
              <Bell className="h-4 w-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="backup" className="flex items-center gap-2 min-h-[44px] flex-1">
              <Download className="h-4 w-4" />
              Backup
            </TabsTrigger>
            <TabsTrigger value="conta" className="flex items-center gap-2 min-h-[44px] flex-1">
              <Lock className="h-4 w-4" />
              Conta
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" className="md:hidden" />
        </ScrollArea>

        <TabsContent value="horarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>Horários e Dias de Trabalho</span>
              </CardTitle>
              <CardDescription>
                Configure os dias da semana e horários em que você atenderá clientes. 
                Estas configurações serão respeitadas nos formulários de agendamento.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <ConfiguracaoHorarios />

          {/* Informações sobre horários */}
          <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-900/20">
            <CardContent className="p-4">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Integração com Agendamentos
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Os horários configurados aqui serão automaticamente aplicados aos formulários 
                de agendamento interno e externo, bloqueando horários indisponíveis.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agendamento-online" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>Configurações do Agendamento Online</span>
              </CardTitle>
              <CardDescription>
                Configure o formulário público de agendamento, informações do salão, redes sociais e regras de agendamento.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <ConfiguracaoAgendamentoOnline />
        </TabsContent>

        <TabsContent value="notificacoes" className="space-y-6">
          <ConfiguracaoNotificacoesAvancadas />
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <ConfiguracaoBackup />
        </TabsContent>

        <TabsContent value="conta" className="space-y-6">
          <ConfiguracaoConta />
        </TabsContent>
      </Tabs>
    </div>
  );
}
