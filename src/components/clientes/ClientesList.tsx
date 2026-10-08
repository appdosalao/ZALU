/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
import { 
  Search, 
  Phone, 
  MessageCircle, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  User,
  Calendar,
  X,
  UsersRound
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Cliente } from "@/types/cliente";
import ClienteForm from "./ClienteForm";
import { toast } from "sonner";
import { useConfigAgendamentoOnline } from "@/hooks/useConfigAgendamentoOnline";
import { normalizeText } from '@/lib/formatters';

interface ClientesListProps {
  clientes: Cliente[];
  onEdit: (cliente: Cliente) => Promise<boolean>;
  onDelete: (id: string) => void;
  onViewDetails: (cliente: Cliente) => void;
}

// Função para verificar se todos os termos de busca estão presentes
const matchesAllTerms = (text: string, searchTerms: string[]): boolean => {
  const normalizedText = normalizeText(text);
  return searchTerms.every(term => normalizedText.includes(term));
};

// Função para destacar texto encontrado
const highlightText = (text: string, searchTerm: string): React.ReactNode => {
  if (!searchTerm.trim()) return text;
  
  const searchTerms = normalizeText(searchTerm).split(/\s+/).filter(Boolean);
  if (searchTerms.length === 0) return text;
  
  const normalizedText = normalizeText(text);
  const result: React.ReactNode[] = [];
  let lastIndex = 0;
  
  // Encontrar todas as posições de match
  const matches: { start: number; end: number }[] = [];
  
  searchTerms.forEach(term => {
    let index = normalizedText.indexOf(term);
    while (index !== -1) {
      matches.push({ start: index, end: index + term.length });
      index = normalizedText.indexOf(term, index + 1);
    }
  });
  
  // Ordenar e mesclar matches sobrepostos
  matches.sort((a, b) => a.start - b.start);
  const mergedMatches: { start: number; end: number }[] = [];
  
  for (const match of matches) {
    if (mergedMatches.length === 0 || match.start > mergedMatches[mergedMatches.length - 1].end) {
      mergedMatches.push({ ...match });
    } else {
      mergedMatches[mergedMatches.length - 1].end = Math.max(
        mergedMatches[mergedMatches.length - 1].end,
        match.end
      );
    }
  }
  
  // Construir resultado com destaques
  for (const match of mergedMatches) {
    if (match.start > lastIndex) {
      result.push(text.slice(lastIndex, match.start));
    }
    result.push(
      <mark key={match.start} className="bg-primary/20 text-primary rounded px-0.5">
        {text.slice(match.start, match.end)}
      </mark>
    );
    lastIndex = match.end;
  }
  
  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }
  
  return result.length > 0 ? result : text;
};

export default function ClientesList({ clientes, onEdit, onDelete, onViewDetails }: ClientesListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { config } = useConfigAgendamentoOnline();

  // Busca otimizada com suporte a múltiplos termos e campos
  const filteredClientes = useMemo(() => {
    if (!searchTerm.trim()) return clientes;
    
    const searchTerms = normalizeText(searchTerm).split(/\s+/).filter(Boolean);
    if (searchTerms.length === 0) return clientes;
    
    return clientes.filter(cliente => {
      const nome = cliente.nomeCompleto || cliente.nome || '';
      const telefone = cliente.telefone?.replace(/\D/g, '') || '';
      const telefoneFormatado = cliente.telefone || '';
      const email = cliente.email || '';
      const servico = cliente.servicoFrequente || '';
      
      // Combinar todos os campos para busca
      const searchableText = `${nome} ${telefone} ${telefoneFormatado} ${email} ${servico}`;
      
      return matchesAllTerms(searchableText, searchTerms);
    });
  }, [clientes, searchTerm]);

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  const sortedClientes = [...filteredClientes].sort((a, b) => 
    (a.nomeCompleto || a.nome || '').localeCompare(b.nomeCompleto || b.nome || '')
  );

  const totalPages = Math.ceil(sortedClientes.length / itemsPerPage);
  const visiblePage = Math.min(currentPage, Math.max(totalPages, 1));
  const startIndex = (visiblePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClientes = sortedClientes.slice(startIndex, endIndex);

  const formatarTelefone = (telefone: string) => {
    const numeros = telefone.replace(/\D/g, '');
    if (numeros.length === 11) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
    }
    return telefone;
  };

  const abrirWhatsApp = (telefone: string, nome: string) => {
    const numeroLimpo = telefone.replace(/\D/g, '');
    const header = `${config.nome_salao || 'Seu Salão'} • ${window.location.origin}`;
    const logoLine = config.logo_url ? `Logo: ${config.logo_url}` : '';
    const mensagem = `${header}\n${logoLine}\n\nOlá ${nome}! Tudo bem?`;
    const url = `https://wa.me/55${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  const ligar = (telefone: string) => {
    window.open(`tel:${telefone}`, '_self');
  };

  const handleDelete = (id: string, nome: string) => {
    onDelete(id);
    toast("Cliente removida", {
      description: `${nome} foi removida com sucesso.`,
    });
  };

  return (
    <Card className="overflow-hidden rounded-3xl border-border/60 shadow-sm">
      <CardHeader className="gap-4 border-b bg-muted/20 p-4 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UsersRound className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-lg font-semibold sm:text-xl">Base de clientes</CardTitle>
                <Badge variant="secondary" className="rounded-full">
                  {filteredClientes.length} {filteredClientes.length === 1 ? 'cliente' : 'clientes'}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                Pesquise, consulte o histórico ou acesse rapidamente os contatos.
              </p>
            </div>
          </div>

          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Buscar clientes"
              placeholder="Buscar por nome, telefone, e-mail ou serviço"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="h-11 rounded-xl border-border/60 bg-background pl-10 pr-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSearch}
                aria-label="Limpar busca"
                className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Indicador de resultados da busca */}
        {searchTerm && (
          <div className="text-sm text-muted-foreground">
            {filteredClientes.length === 0 ? (
              <span>Nenhum cliente encontrado para "<strong>{searchTerm}</strong>"</span>
            ) : (
              <span>
                {filteredClientes.length} cliente{filteredClientes.length !== 1 ? 's' : ''} encontrado{filteredClientes.length !== 1 ? 's' : ''} para "<strong>{searchTerm}</strong>"
              </span>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {currentClientes.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="font-semibold text-responsive-xs">Nome Completo</TableHead>
                    <TableHead className="font-semibold text-responsive-xs">Telefone</TableHead>
                    <TableHead className="font-semibold text-responsive-xs">Serviço Frequente</TableHead>
                    <TableHead className="font-semibold text-responsive-xs">Última Visita</TableHead>
                    <TableHead className="font-semibold text-right text-responsive-xs">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentClientes.map((cliente) => (
                    <TableRow 
                      key={cliente.id} 
                      className="cursor-pointer border-border/50 transition-colors hover:bg-accent/40"
                      onClick={() => onViewDetails(cliente)}
                    >
                      <TableCell className="font-medium text-responsive-sm">
                        {highlightText(cliente.nomeCompleto || cliente.nome || '', searchTerm)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-responsive-xs">{formatarTelefone(cliente.telefone)}</span>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                ligar(cliente.telefone);
                              }}
                              className="btn-touch"
                            >
                              <Phone className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                abrirWhatsApp(cliente.telefone, cliente.nomeCompleto || cliente.nome || '');
                              }}
                              className="btn-touch hover:bg-green-100"
                            >
                              <MessageCircle className="h-3 w-3 text-green-600" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                         <Badge variant="outline" className="bg-accent/50 text-responsive-xs">
                           {cliente.servicoFrequente || 'Não definido'}
                         </Badge>
                      </TableCell>
                        <TableCell className="text-responsive-xs">
                          {cliente.ultimaVisita ? (() => {
                            try {
                              const data = new Date(cliente.ultimaVisita);
                              return isNaN(data.getTime()) ? 'Data inválida' : format(data, "dd/MM/yyyy", { locale: ptBR });
                            } catch (error) {
                              return 'Data inválida';
                            }
                          })() : 'Não definido'}
                        </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewDetails(cliente);
                            }}
                            className="btn-touch"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <ClienteForm
                            cliente={cliente}
                            onSubmit={(data) => onEdit({ ...cliente, ...data, dataNascimento: data.dataNascimento instanceof Date ? data.dataNascimento.toISOString() : data.dataNascimento } as any)}
                            trigger={
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => e.stopPropagation()}
                                className="btn-touch"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            }
                          />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => e.stopPropagation()}
                                className="btn-touch hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-responsive-lg">Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription className="text-responsive-sm">
                                   Tem certeza que deseja excluir <strong>{cliente.nomeCompleto || cliente.nome}</strong>?
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="btn-touch text-responsive-sm">Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                   onClick={() => handleDelete(cliente.id, cliente.nomeCompleto || cliente.nome || '')}
                                  className="bg-destructive hover:bg-destructive/90 btn-touch text-responsive-sm"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Cards - Otimizados */}
            <div className="space-y-3 p-3 lg:hidden">
              {currentClientes.map((cliente) => (
                <Card 
                  key={cliente.id} 
                  className="cursor-pointer rounded-2xl border-border/60 bg-card transition-transform active:scale-[0.99]"
                  onClick={() => onViewDetails(cliente)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Header com avatar placeholder e info */}
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-semibold">
                            {highlightText(cliente.nomeCompleto || cliente.nome || '', searchTerm)}
                          </h3>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {formatarTelefone(cliente.telefone)}
                          </p>
                          {cliente.email && <p className="truncate text-xs text-muted-foreground">{cliente.email}</p>}
                        </div>
                      </div>
                      
                      {/* Info badges */}
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="outline" className="bg-accent/50 text-[10px] h-5 px-1.5 font-normal">
                          {cliente.servicoFrequente || 'Não definido'}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal">
                          <Calendar className="h-2.5 w-2.5 mr-1" />
                          {cliente.ultimaVisita ? (() => {
                            try {
                              const data = new Date(cliente.ultimaVisita);
                              return isNaN(data.getTime()) ? 'Sem visita' : format(data, "dd/MM/yy", { locale: ptBR });
                            } catch (error) {
                              return 'Sem visita';
                            }
                          })() : 'Sem visita'}
                        </Badge>
                      </div>

                      {/* Quick actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            ligar(cliente.telefone);
                          }}
                          className="flex-1 h-9 text-xs btn-touch"
                        >
                          <Phone className="h-3.5 w-3.5 mr-1.5" />
                          Ligar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            abrirWhatsApp(cliente.telefone, cliente.nomeCompleto || cliente.nome || '');
                          }}
                          className="flex-1 h-9 text-xs btn-touch bg-green-50 hover:bg-green-100 border-green-200"
                        >
                          <MessageCircle className="h-3.5 w-3.5 mr-1.5 text-green-600" />
                          WhatsApp
                        </Button>
                      </div>

                      {/* Edit/Delete actions */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
                        <ClienteForm
                          cliente={cliente}
                          onSubmit={(data) => onEdit({ ...cliente, ...data, dataNascimento: data.dataNascimento instanceof Date ? data.dataNascimento.toISOString() : data.dataNascimento } as any)}
                          trigger={
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => e.stopPropagation()}
                              className="h-9 text-xs btn-touch"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Editar
                            </Button>
                          }
                        />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => e.stopPropagation()}
                              className="h-9 text-xs btn-touch hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Excluir
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir <strong>{cliente.nomeCompleto || cliente.nome}</strong>? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                              <AlertDialogCancel className="btn-touch m-0">Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(cliente.id, cliente.nomeCompleto || cliente.nome || '')}
                                className="bg-destructive hover:bg-destructive/90 btn-touch m-0"
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

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex flex-col gap-3 border-t border-border/50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-center text-xs text-muted-foreground sm:text-left sm:text-sm">
                  Exibindo {startIndex + 1}–{Math.min(endIndex, sortedClientes.length)} de {sortedClientes.length} clientes
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    aria-label="Página anterior"
                    disabled={visiblePage === 1}
                    className="h-9 rounded-xl"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    Página {visiblePage} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    aria-label="Próxima página"
                    disabled={visiblePage === totalPages}
                    className="h-9 rounded-xl"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 px-4">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-lilac-light/10 mx-auto">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">
              {searchTerm ? "Nenhuma cliente encontrada" : "Nenhuma cliente cadastrada"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm 
                ? "Tente buscar com outros termos ou limpe o filtro." 
                : "Comece cadastrando sua primeira cliente para começar a usar o sistema."
              }
            </p>
            {searchTerm && (
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm("")}
              >
                Limpar busca
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
