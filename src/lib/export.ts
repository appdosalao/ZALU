import type { RelatorioExportacao } from '@/types/relatorio';
import type { Lancamento } from '@/types/lancamento';
import type { ContaFixa } from '@/types/contaFixa';
import type { Agendamento } from '@/types/agendamento';
import { formatBRL } from '@/lib/formatters';
import DOMPurify from 'dompurify';

const escapeHTML = (value: unknown): string => {
  if (value == null) return '';
  const str = String(value);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;');
};

const safeAttribute = (value: unknown): string => {
  if (value == null) return '';
  const str = String(value);
  if (/^https?:\/\//i.test(str) || /^\/[^\\]*/.test(str)) {
    return escapeHTML(str);
  }
  if (str.startsWith('data:image/')) {
    return escapeHTML(str);
  }
  return '';
};

function downloadBlob(content: BlobPart, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportRelatorioJSON(relatorio: RelatorioExportacao) {
  const filename = `relatorio-financeiro-${relatorio.periodo.replace(/\s+/g, '_')}.json`;
  downloadBlob(JSON.stringify(relatorio, null, 2), filename, 'application/json');
}

function toCSV<T extends Record<string, any>>(rows: T[]): string {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (v: any) => {
    if (v == null) return '';
    const s = String(v);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map(h => escape(row[h])).join(','));
  }
  return lines.join('\n');
}

export function exportLancamentosCSV(lancamentos: Lancamento[], filename = 'lancamentos.csv') {
  const rows = lancamentos.map(l => ({
    id: l.id,
    tipo: l.tipo,
    valor: l.valor,
    data: new Date(l.data).toISOString().split('T')[0],
    descricao: l.descricao,
    categoria: l.categoria || '',
    origemId: l.origemId || '',
    origemTipo: l.origemTipo || '',
    clienteId: l.clienteId || '',
    created_at: new Date(l.created_at).toISOString(),
    updated_at: new Date(l.updated_at).toISOString(),
  }));
  downloadBlob(toCSV(rows), filename, 'text/csv;charset=utf-8');
}

export function exportContasFixasCSV(contas: ContaFixa[], filename = 'contas_fixas.csv') {
  const rows = contas.map(c => ({
    id: c.id,
    nome: c.nome,
    categoria: c.categoria,
    valor: c.valor,
    vencimento: c.proximoVencimento || '',
    pago: c.status === 'pago' ? 'sim' : 'não',
    created_at: c.created_at,
    updated_at: c.updated_at,
  }));
  downloadBlob(toCSV(rows), filename, 'text/csv;charset=utf-8');
}

export function exportAgendamentosCSV(agendamentos: Agendamento[], filename = 'agendamentos.csv') {
  const rows = agendamentos.map(a => ({
    id: a.id,
    clienteId: a.clienteId,
    clienteNome: a.clienteNome,
    servicoId: a.servicoId,
    servicoNome: a.servicoNome,
    data: a.data,
    hora: a.hora,
    duracao: a.duracao,
    valor: a.valor,
    valorPago: a.valorPago,
    valorDevido: a.valorDevido,
    formaPagamento: a.formaPagamento,
    statusPagamento: a.statusPagamento,
    status: a.status,
    origem: a.origem || '',
    confirmado: a.confirmado ? 'sim' : 'não',
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  }));
  downloadBlob(toCSV(rows), filename, 'text/csv;charset=utf-8');
}

export function exportRelatorioCSV(relatorio: RelatorioExportacao) {
  exportLancamentosCSV(relatorio.dadosDetalhados.lancamentos, `lancamentos-${relatorio.periodo.replace(/\s+/g, '_')}.csv`);
  exportContasFixasCSV(relatorio.dadosDetalhados.contasFixas, `contas-fixas-${relatorio.periodo.replace(/\s+/g, '_')}.csv`);
  exportAgendamentosCSV(relatorio.dadosDetalhados.agendamentos, `agendamentos-${relatorio.periodo.replace(/\s+/g, '_')}.csv`);
}

export function exportRelatorioPDF(relatorio: RelatorioExportacao, brand?: { salonName?: string; logoUrl?: string }) {
  const win = window.open('', '_blank', 'noopener,noreferrer');
  if (!win) return;
  const style = `
    body { font-family: Arial, sans-serif; padding: 16px; color: #111; }
    .header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .logo { width: 48px; height: 48px; border-radius: 8px; object-fit: cover; border: 2px solid #d6b2e7; }
    .brand { font-size: 16px; font-weight: 700; }
    h1 { font-size: 18px; margin: 0 0 8px; }
    h2 { font-size: 14px; margin: 12px 0 6px; }
    table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 12px; }
    th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
    .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; font-size: 12px; }
    .summary div { background: #f7f7f7; padding: 8px; border: 1px solid #eee; }
  `;
  const safeLogo = safeAttribute(brand?.logoUrl);
  const html = `
    <html><head><meta charset="utf-8"/><meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' data:; img-src 'self' data: https:; script-src 'unsafe-inline'"/><style>${style}</style><title>Relatório Financeiro</title></head>
    <body>
      <div class="header">
        ${safeLogo ? `<img class="logo" src="${safeLogo}" alt="" />` : ''}
        <div class="brand">${escapeHTML(brand?.salonName || 'Relatório Financeiro')}</div>
      </div>
      <h1>Relatório Financeiro • ${escapeHTML(relatorio.periodo)}</h1>
      <div class="summary">
        <div><strong>Entradas:</strong> ${escapeHTML(formatBRL(relatorio.dadosResumo.totalEntradas))}</div>
        <div><strong>Saídas:</strong> ${escapeHTML(formatBRL(relatorio.dadosResumo.totalSaidas))}</div>
        <div><strong>Lucro:</strong> ${escapeHTML(formatBRL(relatorio.dadosResumo.lucroLiquido))}</div>
      </div>
      <h2>Lançamentos</h2>
      <table>
        <thead><tr><th>Tipo</th><th>Valor</th><th>Data</th><th>Descrição</th><th>Categoria</th></tr></thead>
        <tbody>
          ${relatorio.dadosDetalhados.lancamentos.map(l => `
            <tr><td>${escapeHTML(l.tipo)}</td><td>${escapeHTML(formatBRL(l.valor))}</td><td>${escapeHTML(new Date(l.data).toLocaleDateString('pt-BR'))}</td><td>${escapeHTML(l.descricao)}</td><td>${escapeHTML(l.categoria || '')}</td></tr>
          `).join('')}
        </tbody>
      </table>
      <h2>Contas Fixas</h2>
      <table>
        <thead><tr><th>Nome</th><th>Categoria</th><th>Valor</th><th>Vencimento</th><th>Pago</th></tr></thead>
        <tbody>
          ${relatorio.dadosDetalhados.contasFixas.map(c => `
            <tr><td>${escapeHTML(c.nome)}</td><td>${escapeHTML(c.categoria)}</td><td>${escapeHTML(formatBRL(c.valor))}</td><td>${escapeHTML(c.proximoVencimento || '')}</td><td>${c.status === 'pago' ? 'Sim' : 'Não'}</td></tr>
          `).join('')}
        </tbody>
      </table>
      <h2>Agendamentos</h2>
      <table>
        <thead><tr><th>Cliente</th><th>Serviço</th><th>Data</th><th>Hora</th><th>Valor</th><th>Status</th></tr></thead>
        <tbody>
          ${relatorio.dadosDetalhados.agendamentos.map(a => `
            <tr><td>${escapeHTML(a.clienteNome)}</td><td>${escapeHTML(a.servicoNome)}</td><td>${escapeHTML(a.data)}</td><td>${escapeHTML(a.hora)}</td><td>${escapeHTML(formatBRL(a.valor))}</td><td>${escapeHTML(a.status)}</td></tr>
          `).join('')}
        </tbody>
      </table>
    </body></html>
  `;
  const safeHtml = DOMPurify.sanitize(html, { ADD_TAGS: ['script'], USE_PROFILES: { html: true } });
  win.document.open();
  win.document.write(safeHtml);
  win.document.close();
  try { win.focus(); } catch {}
  setTimeout(() => { try { win.print(); } catch {} }, 400);
}

export function exportDespesasUsoCSV(rows: Array<{ data: string; categoria: string; valor: number; descricao: string }>, filename = 'despesas_de_uso.csv') {
  const csv = toCSV(rows.map(r => ({
    data: r.data,
    categoria: r.categoria,
    valor: r.valor,
    descricao: r.descricao
  })));
  downloadBlob(csv, filename, 'text/csv;charset=utf-8');
}

export function exportDespesasUsoPDF(rows: Array<{ data: string; categoria: string; valor: number; descricao: string }>, periodo: string, brand?: { salonName?: string; logoUrl?: string }) {
  const win = window.open('', '_blank', 'noopener,noreferrer');
  if (!win) return;
  const style = `
    body { font-family: Arial, sans-serif; padding: 16px; color: #111; }
    .header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .logo { width: 48px; height: 48px; border-radius: 8px; object-fit: cover; border: 2px solid #d6b2e7; }
    .brand { font-size: 16px; font-weight: 700; }
    h1 { font-size: 18px; margin: 0 0 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 12px; }
    th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
  `;
  const safeLogo = safeAttribute(brand?.logoUrl);
  const html = `
    <html><head><meta charset="utf-8"/><meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' data:; img-src 'self' data: https:; script-src 'unsafe-inline'"/><style>${style}</style><title>Despesas de Uso</title></head>
    <body>
      <div class="header">
        ${safeLogo ? `<img class="logo" src="${safeLogo}" alt="" />` : ''}
        <div class="brand">${escapeHTML(brand?.salonName || 'Despesas de Uso')}</div>
      </div>
      <h1>Despesas de Uso • ${escapeHTML(periodo)}</h1>
      <table>
        <thead><tr><th>Data</th><th>Categoria</th><th>Valor</th><th>Descrição</th></tr></thead>
        <tbody>
          ${rows.map(r => `<tr><td>${escapeHTML(r.data)}</td><td>${escapeHTML(r.categoria)}</td><td>${escapeHTML(formatBRL(r.valor))}</td><td>${escapeHTML(r.descricao)}</td></tr>`).join('')}
        </tbody>
      </table>
    </body></html>
  `;
  const safeHtml = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  win.document.open();
  win.document.write(safeHtml);
  win.document.close();
  try { win.focus(); } catch {}
  setTimeout(() => { try { win.print(); } catch {} }, 400);
}
export function exportVendasPorProdutoCSV(rows: Array<{ produto: string; quantidade: number; valor_total: number }>, filename = 'vendas_por_produto.csv') {
  const csv = toCSV(rows.map(r => ({
    produto: r.produto,
    quantidade: r.quantidade,
    valor_total: r.valor_total
  })));
  downloadBlob(csv, filename, 'text/csv;charset=utf-8');
}

export function exportVendasPorProdutoPDF(rows: Array<{ produto: string; quantidade: number; valor_total: number }>, periodo: string, brand?: { salonName?: string; logoUrl?: string }) {
  const win = window.open('', '_blank', 'noopener,noreferrer');
  if (!win) return;
  const style = `
    body { font-family: Arial, sans-serif; padding: 16px; color: #111; }
    .header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .logo { width: 48px; height: 48px; border-radius: 8px; object-fit: cover; border: 2px solid #d6b2e7; }
    .brand { font-size: 16px; font-weight: 700; }
    h1 { font-size: 18px; margin: 0 0 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 12px; }
    th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
  `;
  const safeLogo = safeAttribute(brand?.logoUrl);
  const html = `
    <html><head><meta charset="utf-8"/><meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' data:; img-src 'self' data: https:; script-src 'unsafe-inline'"/><style>${style}</style><title>Vendas por Produto</title></head>
    <body>
      <div class="header">
        ${safeLogo ? `<img class="logo" src="${safeLogo}" alt="" />` : ''}
        <div class="brand">${escapeHTML(brand?.salonName || 'Vendas por Produto')}</div>
      </div>
      <h1>Vendas por Produto • ${escapeHTML(periodo)}</h1>
      <table>
        <thead><tr><th>Produto</th><th>Quantidade</th><th>Total</th></tr></thead>
        <tbody>
          ${rows.map(r => `<tr><td>${escapeHTML(r.produto)}</td><td>${escapeHTML(String(r.quantidade))}</td><td>${escapeHTML(formatBRL(r.valor_total))}</td></tr>`).join('')}
        </tbody>
      </table>
    </body></html>
  `;
  const safeHtml = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  win.document.open();
  win.document.write(safeHtml);
  win.document.close();
  try { win.focus(); } catch {}
  setTimeout(() => { try { win.print(); } catch {} }, 400);
}

export function exportMovimentacoesEstoqueCSV(rows: Array<{ id: string; tipo: string; data: string; valor: number; descricao: string; status?: string; itens?: number }>, filename = 'movimentacoes_produtos.csv') {
  const csv = toCSV(rows.map(r => ({
    id: r.id,
    tipo: r.tipo,
    data: r.data,
    valor: r.valor,
    descricao: r.descricao,
    status: r.status || '',
    itens: r.itens || 0
  })));
  downloadBlob(csv, filename, 'text/csv;charset=utf-8');
}

export function exportMovimentacoesEstoquePDF(rows: Array<{ id: string; tipo: string; data: string; valor: number; descricao: string; status?: string; itens?: number }>, periodo?: string, brand?: { salonName?: string; logoUrl?: string }) {
  const win = window.open('', '_blank', 'noopener,noreferrer');
  if (!win) return;
  const style = `
    body { font-family: Arial, sans-serif; padding: 16px; color: #111; }
    .header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .logo { width: 48px; height: 48px; border-radius: 8px; object-fit: cover; border: 2px solid #d6b2e7; }
    .brand { font-size: 16px; font-weight: 700; }
    h1 { font-size: 18px; margin: 0 0 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 6px; font-size: 12px; }
    th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
  `;
  const safeLogo = safeAttribute(brand?.logoUrl);
  const html = `
    <html><head><meta charset="utf-8"/><meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' data:; img-src 'self' data: https:; script-src 'unsafe-inline'"/><style>${style}</style><title>Movimentações de Produtos</title></head>
    <body>
      <div class="header">
        ${safeLogo ? `<img class="logo" src="${safeLogo}" alt="" />` : ''}
        <div class="brand">${escapeHTML(brand?.salonName || 'Movimentações de Produtos')}</div>
      </div>
      <h1>Movimentações de Produtos${periodo ? ` • ${escapeHTML(periodo)}` : ''}</h1>
      <table>
        <thead><tr><th>Tipo</th><th>Data</th><th>Valor</th><th>Descrição</th><th>Status</th><th>Itens</th></tr></thead>
        <tbody>
          ${rows.map(r => `<tr><td>${escapeHTML(r.tipo)}</td><td>${escapeHTML(r.data)}</td><td>${escapeHTML(formatBRL(r.valor))}</td><td>${escapeHTML(r.descricao)}</td><td>${escapeHTML(r.status || '')}</td><td>${escapeHTML(String(r.itens || 0))}</td></tr>`).join('')}
        </tbody>
      </table>
    </body></html>
  `;
  const safeHtml = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  win.document.open();
  win.document.write(safeHtml);
  win.document.close();
  try { win.focus(); } catch {}
  setTimeout(() => { try { win.print(); } catch {} }, 400);
}
