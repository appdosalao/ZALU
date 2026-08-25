import type { ReactNode } from 'react';
import { CheckCircle, Clock, Pause, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusVariant = 'default' | 'destructive' | 'outline' | 'secondary';

interface StatusConfig {
  label: string;
  variant?: StatusVariant;
  className?: string;
  icon?: ReactNode;
}

export type StatusDominio = 'agendamento' | 'pagamento' | 'compra' | 'retorno' | 'cronograma';

const configs: Record<StatusDominio, Record<string, StatusConfig>> = {
  agendamento: {
    agendado: { label: 'Agendado', variant: 'outline', className: 'border-0 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
    concluido: { label: 'Concluído', variant: 'outline', className: 'border-0 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
    cancelado: { label: 'Cancelado', variant: 'outline', className: 'border-0 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
    reagendado: { label: 'Reagendado', variant: 'outline', className: 'border-0 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
  },
  pagamento: {
    pago: { label: 'Pago', variant: 'default' },
    parcial: { label: 'Parcial', variant: 'outline', className: 'border-orange-500 text-orange-600' },
    em_aberto: { label: 'Em Aberto', variant: 'destructive' },
    pendente: { label: 'Pendente', variant: 'outline' },
  },
  compra: {
    pendente: { label: 'Pendente', variant: 'secondary' },
    pago_parcial: { label: 'Pago Parcial', variant: 'default' },
    pago: { label: 'Pago', variant: 'default' },
    vencido: { label: 'Vencido', variant: 'destructive' },
  },
  retorno: {
    Pendente: { label: 'Pendente', variant: 'secondary', icon: <Clock className="h-3 w-3 mr-1" /> },
    Realizado: { label: 'Realizado', variant: 'default', icon: <CheckCircle className="h-3 w-3 mr-1" /> },
    Cancelado: { label: 'Cancelado', variant: 'destructive', icon: <XCircle className="h-3 w-3 mr-1" /> },
  },
  cronograma: {
    ativo: { label: 'Ativo', variant: 'default', className: 'bg-green-100 text-green-800 hover:bg-green-100', icon: <CheckCircle className="w-3 h-3 mr-1" /> },
    cancelado: { label: 'Cancelado', variant: 'destructive', icon: <Pause className="w-3 h-3 mr-1" /> },
    concluido: { label: 'Concluído', variant: 'secondary', icon: <CheckCircle className="w-3 h-3 mr-1" /> },
  },
};

interface StatusBadgeProps {
  status?: string | null;
  dominio: StatusDominio;
}

export function StatusBadge({ status, dominio }: StatusBadgeProps) {
  if (!status) return null;

  const config = configs[dominio]?.[status];

  if (!config) {
    return <Badge variant="outline">{status}</Badge>;
  }

  return (
    <Badge variant={config.variant} className={cn(config.className)}>
      {config.icon}
      {config.label}
    </Badge>
  );
}
