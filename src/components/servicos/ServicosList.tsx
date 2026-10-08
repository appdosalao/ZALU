import { useState } from 'react';
import { 
  Scissors, 
  DollarSign, 
  Clock, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  Layers3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Servico, ServicoFiltros } from '@/types/servico';

interface ServicosListProps {
  servicos: Servico[];
  filtros: ServicoFiltros;
  onFiltrosChange: (filtros: ServicoFiltros) => void;
  onEdit: (servico: Servico) => void;
  onDelete: (id: string) => void;
}

export default function ServicosList({
  servicos,
  filtros,
  onFiltrosChange,
  onEdit,
  onDelete,
}: ServicosListProps) {
  const [servicoParaExcluir, setServicoParaExcluir] = useState<Servico | null>(null);

  const formatarValor = (valor: number) => {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  };

  const formatarDuracao = (duracao: number) => {
    const horas = Math.floor(duracao / 60);
    const minutos = duracao % 60;
    
    if (horas > 0 && minutos > 0) {
      return `${horas}h ${minutos}min`;
    } else if (horas > 0) {
      return `${horas}h`;
    } else {
      return `${minutos}min`;
    }
  };

  const handleOrdenacaoChange = (campo: 'nome' | 'valor' | 'duracao') => {
    const novasDirecao = filtros.ordenacao === campo && filtros.direcao === 'asc' ? 'desc' : 'asc';
    onFiltrosChange({
      ...filtros,
      ordenacao: campo,
      direcao: novasDirecao
    });
  };

  const getIconeOrdenacao = (campo: 'nome' | 'valor' | 'duracao') => {
    if (filtros.ordenacao !== campo) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    }
    return filtros.direcao === 'asc' ? 
      <ArrowUp className="h-4 w-4 text-primary" /> : 
      <ArrowDown className="h-4 w-4 text-primary" />;
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="overflow-hidden rounded-3xl border-border/60 shadow-sm">
        <CardHeader className="border-b bg-muted/20 p-4 sm:p-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="h-5 w-5 text-primary" />
                Catálogo de serviços
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {servicos.length} {servicos.length === 1 ? 'serviço encontrado' : 'serviços encontrados'}
                {filtros.busca ? ` para "${filtros.busca}"` : ''}
              </p>
            </div>
            <Badge variant="secondary" className="w-fit rounded-full">
              <Layers3 className="mr-1.5 h-3.5 w-3.5" />
              {servicos.length} {servicos.length === 1 ? 'item' : 'itens'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-5">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.65fr)]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="Buscar serviços"
                placeholder="Buscar serviço..."
                value={filtros.busca || ''}
                onChange={(e) => onFiltrosChange({ ...filtros, busca: e.target.value })}
                className="h-11 rounded-xl border-border/60 bg-background pl-10 pr-10"
              />
              {!!filtros.busca && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label="Limpar busca"
                  onClick={() => onFiltrosChange({ ...filtros, busca: '' })}
                  className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <Select
              value={`${filtros.ordenacao}-${filtros.direcao}`}
              onValueChange={(value) => {
                const [ordenacao, direcao] = value.split('-') as ['nome' | 'valor' | 'duracao', 'asc' | 'desc'];
                onFiltrosChange({ ...filtros, ordenacao, direcao });
              }}
            >
              <SelectTrigger className="h-11 rounded-xl bg-background">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nome-asc">Nome (A-Z)</SelectItem>
                <SelectItem value="nome-desc">Nome (Z-A)</SelectItem>
                <SelectItem value="valor-asc">Valor (Menor primeiro)</SelectItem>
                <SelectItem value="valor-desc">Valor (Maior primeiro)</SelectItem>
                <SelectItem value="duracao-asc">Duração (Menor primeiro)</SelectItem>
                <SelectItem value="duracao-desc">Duração (Maior primeiro)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
        </CardContent>
      </Card>

      {/* Lista de Serviços */}
      <div className="space-y-4">
        {servicos.length === 0 ? (
          <Card className="rounded-3xl border-border/60 bg-card shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Scissors className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Nenhum serviço encontrado</h3>
              <p className="text-muted-foreground">
                {filtros.busca ? 
                  'Tente outro termo de busca ou limpe o filtro para ver todos os serviços.' :
                  'Comece criando seu primeiro serviço.'
                }
              </p>
              {filtros.busca && (
                <Button
                  variant="outline"
                  className="mt-5 rounded-xl"
                  onClick={() => onFiltrosChange({ ...filtros, busca: '' })}
                >
                  Limpar busca
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Cabeçalho da lista para desktop */}
            <Card className="hidden rounded-2xl border-border/60 bg-muted/30 shadow-none md:block">
              <CardContent className="p-4">
                <div className="grid grid-cols-5 gap-4 items-center font-semibold text-sm text-muted-foreground">
                  <button 
                    className="flex items-center gap-2 hover:text-foreground transition-colors text-left"
                    onClick={() => handleOrdenacaoChange('nome')}
                  >
                    Serviço
                    {getIconeOrdenacao('nome')}
                  </button>
                  <button 
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                    onClick={() => handleOrdenacaoChange('valor')}
                  >
                    Valor
                    {getIconeOrdenacao('valor')}
                  </button>
                  <button 
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                    onClick={() => handleOrdenacaoChange('duracao')}
                  >
                    Duração
                    {getIconeOrdenacao('duracao')}
                  </button>
                  <div>Descrição</div>
                  <div className="text-right">Ações</div>
                </div>
              </CardContent>
            </Card>

            {/* Items da lista */}
            {servicos.map((servico) => (
              <Card 
                key={servico.id} 
                className="rounded-2xl border-border/60 bg-card shadow-sm transition-all duration-200 hover:border-primary/25 hover:shadow-md"
              >
                <CardContent className="p-4 sm:p-5">
                  {/* Layout mobile */}
                  <div className="md:hidden space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-lilac-light/10">
                            <Scissors className="h-3.5 w-3.5 text-primary" />
                          </div>
                          {servico.nome}
                        </h3>
                        {servico.descricao && (
                          <p className="text-xs text-muted-foreground line-clamp-2">{servico.descricao}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(servico)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setServicoParaExcluir(servico)}
                          className="text-destructive hover:text-destructive h-8 w-8 p-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-border/50 pt-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium text-primary text-sm">{formatarValor(servico.valor)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground text-xs">{formatarDuracao(servico.duracao)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Layout desktop */}
                  <div className="hidden md:grid md:grid-cols-5 md:gap-4 md:items-center">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-lilac-light/10">
                        <Scissors className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{servico.nome}</h3>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-primary">{formatarValor(servico.valor)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{formatarDuracao(servico.duracao)}</span>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {servico.descricao || '-'}
                      </p>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(servico)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setServicoParaExcluir(servico)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>

      {/* Dialog de confirmação para exclusão */}
      <AlertDialog open={!!servicoParaExcluir} onOpenChange={() => setServicoParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o serviço "{servicoParaExcluir?.nome}"? 
              Esta ação não pode ser desfeita e pode afetar agendamentos existentes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (servicoParaExcluir) {
                  onDelete(servicoParaExcluir.id);
                  setServicoParaExcluir(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}