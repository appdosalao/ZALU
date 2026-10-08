import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, PiggyBank, Clock, AlertCircle } from "lucide-react";
import { ResumoFinanceiro as ResumoType } from "@/types/lancamento";
import { formatBRL } from '@/lib/formatters';

interface ResumoFinanceiroProps {
  resumo: ResumoType;
}

export default function ResumoFinanceiro({ resumo }: ResumoFinanceiroProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5 animate-fade-in">
      <Card className="rounded-2xl border-border/60 shadow-sm transition-shadow hover:shadow-md">
        <CardContent className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 sm:h-11 sm:w-11">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold text-emerald-700 dark:text-emerald-400 sm:text-lg">
              {formatBRL(resumo.totalEntradas)}
            </p>
            <p className="text-xs text-muted-foreground">Entradas no mês</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="rounded-2xl border-border/60 shadow-sm transition-shadow hover:shadow-md">
        <CardContent className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 sm:h-11 sm:w-11">
            <TrendingDown className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold text-rose-700 dark:text-rose-400 sm:text-lg">
              {formatBRL(resumo.totalSaidas)}
            </p>
            <p className="text-xs text-muted-foreground">Saídas no mês</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-2 rounded-2xl border-border/60 shadow-sm transition-shadow hover:shadow-md sm:col-span-1">
        <CardContent className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${
            resumo.lucro >= 0 
              ? 'bg-primary/10 text-primary' 
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
          }`}>
            {resumo.lucro >= 0 ? (
              <PiggyBank className="h-5 w-5" />
            ) : (
              <DollarSign className="h-5 w-5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className={`truncate text-base font-bold sm:text-lg ${
              resumo.lucro >= 0 ? 'text-primary' : 'text-rose-700 dark:text-rose-400'
            }`}>
              {formatBRL(resumo.lucro)}
            </p>
            <p className="text-xs text-muted-foreground">
              {resumo.lucro >= 0 ? 'Resultado do mês' : 'Prejuízo no mês'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Valor em Aberto */}
      <Card className="rounded-2xl border-border/60 shadow-sm transition-shadow hover:shadow-md">
        <CardContent className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 sm:h-11 sm:w-11">
            <Clock className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold text-amber-700 dark:text-amber-400 sm:text-lg">
              {formatBRL(resumo.valorEmAberto)}
            </p>
            <p className="text-xs text-muted-foreground">A receber</p>
          </div>
        </CardContent>
      </Card>

      {/* Contas a Pagar */}
      <Card className="rounded-2xl border-border/60 shadow-sm transition-shadow hover:shadow-md">
        <CardContent className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 sm:h-11 sm:w-11">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-bold text-rose-700 dark:text-rose-400 sm:text-lg">
              {formatBRL(resumo.contasAPagar)}
            </p>
            <p className="text-xs text-muted-foreground">Contas em aberto</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
