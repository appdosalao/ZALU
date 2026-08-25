import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, PiggyBank, Clock, AlertCircle } from "lucide-react";
import { ResumoFinanceiro as ResumoType } from "@/types/lancamento";
import { formatarMoeda } from "@/lib/format";

interface ResumoFinanceiroProps {
  resumo: ResumoType;
}

export default function ResumoFinanceiro({ resumo }: ResumoFinanceiroProps) {
  return (
    <div className="grid grid-cols-2 gap-2 md:gap-4 md:grid-cols-3 lg:grid-cols-5 animate-fade-in">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover-scale transition-all">
        <CardContent className="flex items-center gap-2 md:gap-4 p-3 md:p-4">
          <div className="flex h-8 w-8 md:h-12 md:w-12 items-center justify-center rounded-lg md:rounded-xl bg-success flex-shrink-0">
            <TrendingUp className="h-4 w-4 md:h-6 md:w-6 text-success-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-lg md:text-xl font-bold text-success truncate">
              {formatarMoeda(resumo.totalEntradas)}
            </p>
            <p className="text-responsive-xs md:text-sm text-muted-foreground">Entradas</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover-scale transition-all">
        <CardContent className="flex items-center gap-2 md:gap-4 p-3 md:p-4">
          <div className="flex h-8 w-8 md:h-12 md:w-12 items-center justify-center rounded-lg md:rounded-xl bg-destructive flex-shrink-0">
            <TrendingDown className="h-4 w-4 md:h-6 md:w-6 text-destructive-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-lg md:text-xl font-bold text-destructive truncate">
              {formatarMoeda(resumo.totalSaidas)}
            </p>
            <p className="text-responsive-xs md:text-sm text-muted-foreground">Saídas</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover-scale transition-all col-span-2 md:col-span-1">
        <CardContent className="flex items-center gap-2 md:gap-4 p-3 md:p-4">
          <div className={`flex h-8 w-8 md:h-12 md:w-12 items-center justify-center rounded-lg md:rounded-xl flex-shrink-0 ${
            resumo.lucro >= 0 
              ? 'bg-primary' 
              : 'bg-destructive'
          }`}>
            {resumo.lucro >= 0 ? (
              <PiggyBank className="h-4 w-4 md:h-6 md:w-6 text-primary-foreground" />
            ) : (
              <DollarSign className="h-4 w-4 md:h-6 md:w-6 text-destructive-foreground" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-lg md:text-xl font-bold truncate ${
              resumo.lucro >= 0 ? 'text-primary' : 'text-destructive'
            }`}>
              {formatarMoeda(resumo.lucro)}
            </p>
            <p className="text-responsive-xs md:text-sm text-muted-foreground">
              {resumo.lucro >= 0 ? 'Lucro' : 'Prejuízo'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Valor em Aberto */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover-scale transition-all">
        <CardContent className="flex items-center gap-2 md:gap-4 p-3 md:p-4">
          <div className="flex h-8 w-8 md:h-12 md:w-12 items-center justify-center rounded-lg md:rounded-xl bg-warning flex-shrink-0">
            <Clock className="h-4 w-4 md:h-4 md:w-4 text-warning-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-lg md:text-xl font-bold text-warning truncate">
              {formatarMoeda(resumo.valorEmAberto)}
            </p>
            <p className="text-responsive-xs md:text-sm text-muted-foreground">Em Aberto</p>
          </div>
        </CardContent>
      </Card>

      {/* Contas a Pagar */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover-scale transition-all">
        <CardContent className="flex items-center gap-2 md:gap-4 p-3 md:p-4">
          <div className="flex h-8 w-8 md:h-12 md:w-12 items-center justify-center rounded-lg md:rounded-xl bg-destructive flex-shrink-0">
            <AlertCircle className="h-4 w-4 md:h-4 md:w-4 text-destructive-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-lg md:text-xl font-bold text-destructive truncate">
              {formatarMoeda(resumo.contasAPagar)}
            </p>
            <p className="text-responsive-xs md:text-sm text-muted-foreground">A Pagar</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
