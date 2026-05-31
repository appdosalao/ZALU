import React, { useState, useEffect, useMemo } from 'react';
import { Search, Download, Filter, User, Calendar, CreditCard, Mail, Phone, X, Scissors, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSupabaseAdmin } from '@/hooks/useSupabaseAdmin';
import type { Usuario } from '@/types/usuario';
import type { Database } from '@/integrations/supabase/types';

type Servico = Database['public']['Tables']['servicos']['Row'];
type Cliente = Database['public']['Tables']['clientes']['Row'];
type Agendamento = Database['public']['Tables']['agendamentos']['Row'];

// Função para exportar CSV
const exportToCSV = (usuarios: Usuario[]) => {
  const headers = [
    'ID', 'Nome Completo', 'E-mail', 'Telefone', 
    'Data de Cadastro', 'Plano', 'Status', 
    'Data Último Pagamento', 'Acesso Pago'
  ];
  
  const csvContent = [
    headers.join(','),
    ...usuarios.map(u => [
      u.id,
      `"${u.nome_completo}"`,
      u.email,
      u.telefone,
      u.created_at,
      u.plan_type || '-',
      u.subscription_status || '-',
      u.paid_at || '-',
      u.paid_access ? 'Sim' : 'Não'
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `usuarios_salao_de_bolso_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function AdminUsuarios() {
  const { usuarios, loading, loadAllUsuarios, loadUserServicos, loadUserClientes, loadUserAgendamentos } = useSupabaseAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'todos' | 'ativos' | 'inativos'>('todos');
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [userDetails, setUserDetails] = useState<{
    servicos: Servico[];
    clientes: Cliente[];
    agendamentos: Agendamento[];
    loading: boolean;
  }>({ servicos: [], clientes: [], agendamentos: [], loading: false });

  // Carregar usuários ao montar o componente
  useEffect(() => {
    loadAllUsuarios();
  }, [loadAllUsuarios]);

  // Carregar detalhes do usuário quando for selecionado
  useEffect(() => {
    if (selectedUser) {
      const loadDetails = async () => {
        setUserDetails(prev => ({ ...prev, loading: true }));
        const [servicos, clientes, agendamentos] = await Promise.all([
          loadUserServicos(selectedUser.id),
          loadUserClientes(selectedUser.id),
          loadUserAgendamentos(selectedUser.id),
        ]);
        setUserDetails({ servicos, clientes, agendamentos, loading: false });
      };
      loadDetails();
    }
  }, [selectedUser, loadUserServicos, loadUserClientes, loadUserAgendamentos]);

  // Filtrar usuários com base no termo de busca e no filtro ativo
  const filteredUsuarios = useMemo(() => {
    let filtered = usuarios;

    // Filtrar por busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(u => 
        u.nome_completo.toLowerCase().includes(term) || 
        u.email.toLowerCase().includes(term)
      );
    }

    // Filtrar por status
    if (activeFilter === 'ativos') {
      filtered = filtered.filter(u => 
        u.subscription_status === 'active' || u.paid_access
      );
    } else if (activeFilter === 'inativos') {
      filtered = filtered.filter(u => 
        u.subscription_status !== 'active' && !u.paid_access
      );
    }

    return filtered;
  }, [usuarios, searchTerm, activeFilter]);

  // Renderizar badge de status do usuário
  const renderStatusBadge = (usuario: Usuario) => {
    if (usuario.isAdmin) {
      return <Badge className="bg-rose-500 text-white hover:bg-rose-600">Admin</Badge>;
    }
    
    if (usuario.paid_access || usuario.subscription_status === 'active') {
      return <Badge className="bg-green-500 text-white hover:bg-green-600">Ativo</Badge>;
    }
    
    if (usuario.subscription_status === 'trial') {
      return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Em Teste</Badge>;
    }
    
    return <Badge className="bg-gray-500 text-white hover:bg-gray-600">Inativo</Badge>;
  };

  // Calcular estatísticas
  const calculateStats = () => {
    if (!selectedUser) return null;
    const { servicos, clientes, agendamentos } = userDetails;
    
    // Calcular média de agendamentos por mês (últimos 12 meses)
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    
    const agendamentosLastYear = agendamentos.filter(
      a => new Date(a.data) >= twelveMonthsAgo
    );
    
    // Agrupar por mês
    const agendamentosByMonth: Record<string, number> = {};
    agendamentosLastYear.forEach(a => {
      const date = new Date(a.data);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      agendamentosByMonth[key] = (agendamentosByMonth[key] || 0) + 1;
    });
    
    const monthCount = Object.keys(agendamentosByMonth).length || 1;
    const averageAgendamentos = agendamentosLastYear.length / monthCount;
    
    return {
      totalServicos: servicos.length,
      totalClientes: clientes.length,
      totalAgendamentos: agendamentos.length,
      averageAgendamentos: averageAgendamentos.toFixed(1)
    };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Usuários</h1>
        <Button 
          onClick={() => exportToCSV(filteredUsuarios)}
          className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Exportar CSV
        </Button>
      </div>

      {/* Filtros e busca */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                placeholder="Buscar por nome ou e-mail..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Tabs 
              defaultValue="todos" 
              value={activeFilter}
              onValueChange={(v) => setActiveFilter(v as any)}
              className="w-full md:w-auto"
            >
              <TabsList className="bg-gray-100">
                <TabsTrigger value="todos" className="data-[state=active]:bg-white">Todos</TabsTrigger>
                <TabsTrigger value="ativos" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">Ativos</TabsTrigger>
                <TabsTrigger value="inativos" className="data-[state=active]:bg-gray-200">Inativos</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Total de Usuários</p>
            <p className="text-3xl font-bold text-gray-800">{usuarios.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Usuários Ativos</p>
            <p className="text-3xl font-bold text-green-800">
              {usuarios.filter(u => u.subscription_status === 'active' || u.paid_access).length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-amber-100">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Em Teste</p>
            <p className="text-3xl font-bold text-yellow-800">
              {usuarios.filter(u => u.subscription_status === 'trial').length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-rose-50 to-pink-100">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Inativos</p>
            <p className="text-3xl font-bold text-rose-800">
              {usuarios.filter(u => u.subscription_status !== 'active' && !u.paid_access && u.subscription_status !== 'trial').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Listagem de usuários */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Lista de Usuários ({filteredUsuarios.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin h-12 w-12 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-muted-foreground">Carregando usuários...</p>
            </div>
          ) : filteredUsuarios.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground text-lg">Nenhum usuário encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Usuário</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Contato</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Data de Cadastro</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Plano</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-700">Último Pagamento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsuarios.map(usuario => (
                    <tr 
                      key={usuario.id} 
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedUser(usuario)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-bold">
                            {usuario.nome_completo.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{usuario.nome_completo}</p>
                            <p className="text-xs text-gray-500">{usuario.nome_personalizado_app}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="text-sm flex items-center gap-1">
                            <Mail className="w-3 h-3 text-gray-400" />
                            {usuario.email}
                          </p>
                          <p className="text-sm flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gray-400" />
                            {usuario.telefone}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm">
                          {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-medium">
                          {usuario.plan_type === 'mensal' ? 'Mensal' : 
                           usuario.plan_type === 'vitalicio' ? 'Vitalício' : '-'}
                        </p>
                      </td>
                      <td className="p-4">
                        {renderStatusBadge(usuario)}
                      </td>
                      <td className="p-4">
                        <p className="text-sm">
                          {usuario.paid_at ? new Date(usuario.paid_at).toLocaleDateString('pt-BR') : '-'}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Sheet */}
      {selectedUser && (
        <Sheet open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
          <SheetContent className="w-full sm:max-w-lg md:max-w-2xl overflow-hidden">
            <SheetHeader className="pb-4">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-xl">Detalhes do Usuário</SheetTitle>
                <SheetClose asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                </SheetClose>
              </div>
              <SheetDescription>
                Visualize todos os dados e estatísticas do usuário
              </SheetDescription>
            </SheetHeader>
            <Separator />
            <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
              {userDetails.loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin h-10 w-10 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-muted-foreground">Carregando detalhes...</p>
                </div>
              ) : (
                <div className="space-y-6 py-4">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white text-2xl font-bold">
                        {selectedUser.nome_completo.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{selectedUser.nome_completo}</h3>
                        <p className="text-muted-foreground">{selectedUser.email}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Nome do Salão</p>
                        <p className="font-medium">{selectedUser.nome_personalizado_app}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Telefone</p>
                        <p className="font-medium">{selectedUser.telefone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Data de Cadastro</p>
                        <p className="font-medium">{new Date(selectedUser.created_at).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <div className="mt-1">{renderStatusBadge(selectedUser)}</div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Plano</p>
                        <p className="font-medium">
                          {selectedUser.plan_type === 'mensal' ? 'Mensal' : 
                           selectedUser.plan_type === 'vitalicio' ? 'Vitalício' : 'Sem Plano'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Último Pagamento</p>
                        <p className="font-medium">
                          {selectedUser.paid_at ? new Date(selectedUser.paid_at).toLocaleDateString('pt-BR') : 'Nunca'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        <strong>Aviso:</strong> Senhas são armazenadas de forma criptografada e não podem ser recuperadas.
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Statistics */}
                  {stats && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">Estatísticas</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-gradient-to-br from-pink-50 to-rose-100">
                          <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-pink-200 rounded-full">
                              <Scissors className="w-5 h-5 text-pink-700" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Serviços</p>
                              <p className="text-2xl font-bold text-pink-800">{stats.totalServicos}</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100">
                          <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-blue-200 rounded-full">
                              <Users className="w-5 h-5 text-blue-700" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Clientes</p>
                              <p className="text-2xl font-bold text-blue-800">{stats.totalClientes}</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-green-50 to-emerald-100">
                          <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-green-200 rounded-full">
                              <Clock className="w-5 h-5 text-green-700" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Total Agendamentos</p>
                              <p className="text-2xl font-bold text-green-800">{stats.totalAgendamentos}</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-yellow-50 to-amber-100">
                          <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-yellow-200 rounded-full">
                              <Calendar className="w-5 h-5 text-yellow-700" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Média/Mês</p>
                              <p className="text-2xl font-bold text-yellow-800">{stats.averageAgendamentos}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                  
                  <Separator />
                  
                  {/* Lists */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Serviços Cadastrados</h4>
                    {userDetails.servicos.length === 0 ? (
                      <p className="text-muted-foreground">Nenhum serviço cadastrado</p>
                    ) : (
                      <div className="space-y-2">
                        {userDetails.servicos.map(servico => (
                          <div key={servico.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                            <div>
                              <p className="font-medium">{servico.nome}</p>
                              <p className="text-sm text-muted-foreground">R$ {servico.preco?.toFixed(2)}</p>
                            </div>
                            <Badge variant="secondary">{servico.duracao} min</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Clientes Cadastrados</h4>
                    {userDetails.clientes.length === 0 ? (
                      <p className="text-muted-foreground">Nenhum cliente cadastrado</p>
                    ) : (
                      <div className="space-y-2">
                        {userDetails.clientes.slice(0, 5).map(cliente => (
                          <div key={cliente.id} className="p-3 bg-gray-50 rounded-lg">
                            <p className="font-medium">{cliente.nome}</p>
                            {cliente.telefone && (
                              <p className="text-sm text-muted-foreground">{cliente.telefone}</p>
                            )}
                          </div>
                        ))}
                        {userDetails.clientes.length > 5 && (
                          <p className="text-sm text-muted-foreground">
                            + {userDetails.clientes.length - 5} mais clientes
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Agendamentos Recentes</h4>
                    {userDetails.agendamentos.length === 0 ? (
                      <p className="text-muted-foreground">Nenhum agendamento cadastrado</p>
                    ) : (
                      <div className="space-y-2">
                        {userDetails.agendamentos
                          .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                          .slice(0, 5)
                          .map(agendamento => (
                            <div key={agendamento.id} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">
                                    {new Date(agendamento.data).toLocaleDateString('pt-BR')}
                                  </p>
                                  <p className="text-sm text-muted-foreground">{agendamento.hora}</p>
                                </div>
                                <Badge variant={
                                  agendamento.status === 'confirmado' ? 'default' :
                                  agendamento.status === 'cancelado' ? 'destructive' : 'secondary'
                                }>
                                  {agendamento.status || 'Pendente'}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        {userDetails.agendamentos.length > 5 && (
                          <p className="text-sm text-muted-foreground">
                            + {userDetails.agendamentos.length - 5} mais agendamentos
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </ScrollArea>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
