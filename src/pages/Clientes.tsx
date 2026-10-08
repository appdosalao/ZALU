import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, ContactRound, CalendarDays, Scissors } from "lucide-react";
import { Cliente, ClienteFormData } from "@/types/cliente";
import { useSupabaseClientes } from "@/hooks/useSupabaseClientes";
import ClienteForm from "@/components/clientes/ClienteForm";
import ClientesList from "@/components/clientes/ClientesList";
import ClienteDetalhes from "@/components/clientes/ClienteDetalhes";

export default function Clientes() {
  const { clientes, criarCliente, atualizarCliente, excluirCliente, carregarEstatisticasCliente } = useSupabaseClientes();
  const [clienteSelecionada, setClienteSelecionada] = useState<Cliente | null>(null);
  const [detalhesOpen, setDetalhesOpen] = useState(false);

  const handleAddCliente = async (data: ClienteFormData) => {
    return await criarCliente(data);
  };

  const handleEditCliente = async (clienteAtualizada: Cliente) => {
    const sucesso = await atualizarCliente(clienteAtualizada.id, clienteAtualizada);
    if (sucesso && clienteSelecionada?.id === clienteAtualizada.id) {
      setClienteSelecionada(clienteAtualizada);
    }
    return sucesso;
  };

  const handleDeleteCliente = async (id: string) => {
    await excluirCliente(id);
    if (clienteSelecionada?.id === id) {
      setClienteSelecionada(null);
      setDetalhesOpen(false);
    }
  };

  const handleViewDetails = async (cliente: Cliente) => {
    setClienteSelecionada(cliente);
    setDetalhesOpen(true);
    
    // Carregar estatísticas sob demanda quando visualizar detalhes
    if (cliente.historicoServicos?.length === 0) {
      const stats = await carregarEstatisticasCliente(cliente.id);
      if (stats && clienteSelecionada?.id === cliente.id) {
        setClienteSelecionada(prev => prev ? { ...prev, ...stats } : null);
      }
    }
  };

  const clientesAtivas = clientes.length;
  const visitasEsteMes = clientes.filter(cliente => {
    if (!cliente.ultimaVisita) return false;
    
    try {
      const agora = new Date();
      const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
      
      let ultimaVisita: Date;
      if (typeof cliente.ultimaVisita === 'string') {
        ultimaVisita = new Date(cliente.ultimaVisita);
      } else if (cliente.ultimaVisita instanceof Date) {
        ultimaVisita = cliente.ultimaVisita;
      } else {
        return false;
      }
      
      // Verificar se a data é válida
      if (isNaN(ultimaVisita.getTime())) {
        return false;
      }
      
      return ultimaVisita >= inicioMes;
    } catch (error) {
      console.error('Erro ao processar data da última visita:', error);
      return false;
    }
  }).length;

  const totalServicos = clientes.reduce((total, cliente) => 
    total + (cliente.historicoServicos?.length || 0), 0
  );

  return (
    <div className="space-y-5 p-3 sm:space-y-7 sm:p-0">
      <div className="overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card to-primary/[0.07] shadow-sm">
        <div className="flex flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-3 rounded-full px-3 py-1">
              <ContactRound className="mr-1.5 h-3.5 w-3.5" />
              Relacionamento e cadastro
            </Badge>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Clientes</h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Consulte contatos, acompanhe o histórico e mantenha sua base de clientes organizada.
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <ClienteForm onSubmit={handleAddCliente} />
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4 sm:p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold tracking-tight">{clientesAtivas}</p>
              <p className="text-sm text-muted-foreground">Clientes cadastradas</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-border/60 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4 sm:p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold tracking-tight">{visitasEsteMes}</p>
              <p className="text-sm text-muted-foreground">Com visita neste mês</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-border/60 shadow-sm sm:col-span-2 xl:col-span-1">
          <CardContent className="flex items-center gap-4 p-4 sm:p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Scissors className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold tracking-tight">{totalServicos}</p>
              <p className="text-sm text-muted-foreground">Serviços no histórico</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Clientes */}
      <ClientesList
        clientes={clientes}
        onEdit={handleEditCliente}
        onDelete={handleDeleteCliente}
        onViewDetails={handleViewDetails}
      />

      {/* Modal de Detalhes */}
      <ClienteDetalhes
        cliente={clienteSelecionada}
        open={detalhesOpen}
        onOpenChange={setDetalhesOpen}
        onEdit={handleEditCliente}
      />
    </div>
  );
}