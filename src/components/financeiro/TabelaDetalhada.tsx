import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import { exportLancamentosCSV, exportContasFixasCSV, exportAgendamentosCSV, exportRelatorioPDF } from "@/lib/export";
import { DadosRelatorio } from "@/types/relatorio";
import { Lancamento } from "@/types/lancamento";
import { ContaFixa } from "@/types/contaFixa";
import { Agendamento } from "@/types/agendamento";
import { formatarMoeda, formatarData } from "@/lib/format";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface ControlesPaginacaoProps {
  pagina: number;
  total: number;
  itensPorPagina: number;
  onPaginaChange: (pagina: number) => void;
}

function ControlesPaginacao({ pagina, total, itensPorPagina, onPaginaChange }: ControlesPaginacaoProps) {
  const totalPaginas = Math.max(1, Math.ceil(total / itensPorPagina));

  return (
    <div className="flex items-center justify-between pt-2">
      <span className="text-sm text-muted-foreground">
        Página {pagina} de {totalPaginas}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={pagina <= 1}
          onClick={() => onPaginaChange(pagina - 1)}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={pagina >= totalPaginas}
          onClick={() => onPaginaChange(pagina + 1)}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}

interface TabelaDetalhadaProps {
  dados: DadosRelatorio;
  dadosDetalhados: {
    lancamentos: Lancamento[];
    contasFixas: ContaFixa[];
    agendamentos: Agendamento[];
  };
}

export default function TabelaDetalhada({ dados, dadosDetalhados }: TabelaDetalhadaProps) {
  const [paginaLancamentos, setPaginaLancamentos] = useState(1);
  const [paginaContas, setPaginaContas] = useState(1);
  const [paginaAgendamentos, setPaginaAgendamentos] = useState(1);
  
  const itensPorPagina = 10;

  const exportarPDF = () => {
    exportRelatorioPDF({
      titulo: 'Relatório Financeiro',
      periodo: 'Detalhado',
      dadosResumo: dados,
      dadosDetalhados,
      geradoEm: new Date(),
    });
  };

  const exportarExcel = () => {
    exportLancamentosCSV(dadosDetalhados.lancamentos, 'lancamentos.csv');
    exportContasFixasCSV(dadosDetalhados.contasFixas, 'contas_fixas.csv');
    exportAgendamentosCSV(dadosDetalhados.agendamentos, 'agendamentos.csv');
  };

  // Paginação para lançamentos
  const lancamentosPaginados = dadosDetalhados.lancamentos.slice(
    (paginaLancamentos - 1) * itensPorPagina,
    paginaLancamentos * itensPorPagina
  );

  // Paginação para contas fixas
  const contasPaginadas = dadosDetalhados.contasFixas.slice(
    (paginaContas - 1) * itensPorPagina,
    paginaContas * itensPorPagina
  );

  // Paginação para agendamentos
  const agendamentosPaginados = dadosDetalhados.agendamentos.slice(
    (paginaAgendamentos - 1) * itensPorPagina,
    paginaAgendamentos * itensPorPagina
  );

  return (
    <div className="space-y-6">
      {/* Resumo das Categorias */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
          <CardTitle>Análise por Categorias</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportarPDF}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={exportarExcel}>
              <Download className="h-4 w-4 mr-2" />
              Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Entradas</TableHead>
                <TableHead className="text-right">Saídas</TableHead>
                <TableHead className="text-right">Lucro</TableHead>
                <TableHead className="text-right">Participação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dados.categoriasMaisLucrativas.map((categoria, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{categoria.categoria}</TableCell>
                  <TableCell className="text-right text-green-600">
                    {formatarMoeda(categoria.entradas)}
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    {formatarMoeda(categoria.saidas)}
                  </TableCell>
                  <TableCell className={`text-right ${categoria.lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatarMoeda(categoria.lucro)}
                  </TableCell>
                  <TableCell className="text-right">
                    {categoria.percentual.toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Serviços Mais Vendidos */}
      <Card>
        <CardHeader>
          <CardTitle>Serviços Mais Vendidos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serviço</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
                <TableHead className="text-right">Participação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dados.servicosMaisVendidos.map((servico, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{servico.nome}</TableCell>
                  <TableCell className="text-right">{servico.quantidade}</TableCell>
                  <TableCell className="text-right text-green-600">
                    {formatarMoeda(servico.valorTotal)}
                  </TableCell>
                  <TableCell className="text-right">
                    {servico.percentual.toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dados Detalhados */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Detalhados</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="lancamentos">
            <TabsList className="w-full">
              <TabsTrigger value="lancamentos">
                Lançamentos ({dadosDetalhados.lancamentos.length})
              </TabsTrigger>
              <TabsTrigger value="agendamentos">
                Agendamentos ({dadosDetalhados.agendamentos.length})
              </TabsTrigger>
              <TabsTrigger value="contas">
                Contas Fixas ({dadosDetalhados.contasFixas.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="lancamentos" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lancamentosPaginados.map((lancamento) => (
                    <TableRow key={lancamento.id}>
                      <TableCell>{formatarData(lancamento.data)}</TableCell>
                      <TableCell>{lancamento.descricao}</TableCell>
                      <TableCell>{lancamento.categoria || 'Sem categoria'}</TableCell>
                      <TableCell>
                        <Badge variant={lancamento.tipo === 'entrada' ? 'default' : 'destructive'}>
                          {lancamento.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right ${lancamento.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                        {formatarMoeda(lancamento.valor)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ControlesPaginacao
                pagina={paginaLancamentos}
                total={dadosDetalhados.lancamentos.length}
                itensPorPagina={itensPorPagina}
                onPaginaChange={setPaginaLancamentos}
              />
            </TabsContent>

            <TabsContent value="agendamentos" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-right">Pago</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agendamentosPaginados.map((agendamento) => (
                    <TableRow key={agendamento.id}>
                      <TableCell>{formatarData(agendamento.data)}</TableCell>
                      <TableCell>Cliente</TableCell>
<TableCell><StatusBadge status={agendamento.status} dominio="agendamento" /></TableCell>
<TableCell><StatusBadge status={agendamento.statusPagamento} dominio="pagamento" /></TableCell>
                      <TableCell className="text-right">
                        {formatarMoeda(agendamento.valor)}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        {formatarMoeda(agendamento.valorPago || 0)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ControlesPaginacao
                pagina={paginaAgendamentos}
                total={dadosDetalhados.agendamentos.length}
                itensPorPagina={itensPorPagina}
                onPaginaChange={setPaginaAgendamentos}
              />
            </TabsContent>

            <TabsContent value="contas" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contasPaginadas.map((conta) => (
                    <TableRow key={conta.id}>
                      <TableCell className="font-medium">{conta.nome}</TableCell>
                      <TableCell>{conta.categoria}</TableCell>
                      <TableCell>
                        {conta.proximoVencimento ? formatarData(conta.proximoVencimento) : '-'}
                      </TableCell>
                      <TableCell><StatusBadge status={conta.status} dominio="pagamento" /></TableCell>
                      <TableCell className="text-right text-red-600">
                        {formatarMoeda(conta.valor)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ControlesPaginacao
                pagina={paginaContas}
                total={dadosDetalhados.contasFixas.length}
                itensPorPagina={itensPorPagina}
                onPaginaChange={setPaginaContas}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
