import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  MessageCircle, 
  Calendar,
  User,
  AlertCircle
} from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import { AgendamentoEnriquecido } from "@/types/agendamento";
import { toast } from "@/hooks/use-toast";
import { formatarMoeda, formatarData } from "@/lib/format";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { abrirWhatsApp } from "@/lib/whatsapp";

interface TabelaPagamentosClientesProps {
  agendamentos: AgendamentoEnriquecido[];
}

export default function TabelaPagamentosClientes({ agendamentos }: TabelaPagamentosClientesProps) {
  const [busca, setBusca] = useState("");

  // Filtrar apenas agendamentos que tenham valores pendentes ou concluídos
  const agendamentosComPagamento = agendamentos.filter(agendamento => 
    (agendamento.status === 'concluido' || agendamento.valorPago > 0) &&
    (agendamento.clienteNome || '').toLowerCase().includes(busca.toLowerCase())
  );

  const handleEnviarCobranca = (agendamento: AgendamentoEnriquecido) => {
    const mensagem = `Olá ${agendamento.clienteNome}! 

Você tem um saldo devedor de ${formatarMoeda(agendamento.valorDevido || 0)} referente ao serviço ${agendamento.servicoNome} realizado em ${formatarData(agendamento.data)}.

${agendamento.dataPrevistaPagamento ? `Data prevista para pagamento: ${formatarData(agendamento.dataPrevistaPagamento)}` : ''}

Por favor, entre em contato para acertarmos o pagamento. Obrigado!`;

    abrirWhatsApp(agendamento.clienteTelefone || '', mensagem, '');
    
    toast({
      title: "WhatsApp aberto",
      description: "Mensagem de cobrança preparada no WhatsApp.",
    });
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Pagamentos dos Clientes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Busca */}
        <SearchInput
          placeholder="Buscar cliente..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="max-w-sm"
        />

        {/* Tabela */}
        <div className="rounded-md border border-border/50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Valor Pago</TableHead>
                <TableHead>Saldo Devedor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Prevista</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agendamentosComPagamento.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Nenhum pagamento encontrado
                  </TableCell>
                </TableRow>
              ) : (
                agendamentosComPagamento.map((agendamento) => (
                  <TableRow key={agendamento.id}>
                    <TableCell className="font-medium">
                      {agendamento.clienteNome}
                    </TableCell>
                    <TableCell>{agendamento.servicoNome}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatarData(agendamento.data, 'dd/MM/yy')}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatarMoeda(agendamento.valor)}
                    </TableCell>
                    <TableCell className="text-green-600 font-semibold">
                      {formatarMoeda(agendamento.valorPago)}
                    </TableCell>
                    <TableCell className={`font-semibold ${
                      (agendamento.valorDevido || 0) > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {formatarMoeda(agendamento.valorDevido || 0)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={agendamento.statusPagamento} dominio="pagamento" />
                    </TableCell>
                    <TableCell>
                      {agendamento.dataPrevistaPagamento ? (
                        <div className="flex items-center gap-1 text-sm">
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                          {formatarData(agendamento.dataPrevistaPagamento, 'dd/MM/yy')}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {(agendamento.valorDevido || 0) > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEnviarCobranca(agendamento)}
                          className="flex items-center gap-1"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Cobrar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Resumo */}
        {agendamentosComPagamento.length > 0 && (
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Total de Clientes</p>
                <p className="text-2xl font-bold text-primary">
                  {new Set(agendamentosComPagamento.map(a => a.clienteId)).size}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Total Pago</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatarMoeda(agendamentosComPagamento.reduce((total, a) => total + a.valorPago, 0))}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saldo Total Devedor</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatarMoeda(agendamentosComPagamento.reduce((total, a) => total + (a.valorDevido || 0), 0))}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
