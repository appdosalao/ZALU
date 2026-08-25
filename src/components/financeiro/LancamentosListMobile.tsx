import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Edit, 
  Trash2,
  Tag,
  Receipt
} from "lucide-react";
import { Lancamento } from "@/types/lancamento";
import { formatarData } from "@/lib/format";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface LancamentosListMobileProps {
  lancamentos: Lancamento[];
  onEdit: (lancamento: Lancamento) => void;
  onDelete: (id: string) => void;
}

export function LancamentosListMobile({ 
  lancamentos, 
  onEdit, 
  onDelete 
}: LancamentosListMobileProps) {
  const formatarValor = (valor: number) => {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  };

  if (lancamentos.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="py-8 md:py-12">
          <div className="flex flex-col items-center gap-2 md:gap-3 animate-fade-in">
            <Receipt className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground/50" />
            <div className="text-center">
              <p className="text-sm md:text-base font-medium text-foreground">Nenhum lançamento encontrado</p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">
                Adicione seu primeiro lançamento financeiro
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2 md:space-y-3">
      {lancamentos.map((lancamento) => (
        <Card 
          key={lancamento.id} 
          className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden hover-scale animate-fade-in active:scale-[0.99] transition-transform"
        >
          <CardContent className="p-3 mobile-card">
            <div className="space-y-2 md:space-y-3">
              {/* Header with type and value */}
              <div className="flex items-start justify-between gap-2 md:gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {lancamento.tipo === 'entrada' ? (
                    <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <TrendingDown className="h-4 w-4 md:h-5 md:w-5 text-red-600 flex-shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-xs md:text-base truncate">
                      {lancamento.descricao}
                    </h3>
                    <p className="text-2xs md:text-xs text-muted-foreground">
                      {formatarData(lancamento.data)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <p className={`font-bold text-sm md:text-lg ${
                    lancamento.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {lancamento.tipo === 'entrada' ? '+' : '-'} {formatarValor(lancamento.valor)}
                  </p>
                </div>
              </div>

              {/* Category badge */}
              {lancamento.categoria && (
                <div className="flex items-center gap-2">
                  <Tag className="h-2.5 w-2.5 md:h-3 md:w-3 text-muted-foreground" />
                  <Badge variant="outline" className="text-2xs md:text-xs h-5 px-2 font-normal">
                    {lancamento.categoria}
                  </Badge>
                </div>
              )}

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(lancamento)}
                  className="btn-touch hover-scale"
                  aria-label="Editar lançamento"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="btn-touch hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 hover-scale"
                      aria-label="Excluir lançamento"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o lançamento "{lancamento.descricao}"? 
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="btn-touch">Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(lancamento.id)}
                        className="bg-destructive hover:bg-destructive/90 btn-touch"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
