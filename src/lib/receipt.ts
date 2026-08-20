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
  if (/^https?:\/\//i.test(str) || /^\/[^\\]*/.test(str)) return escapeHTML(str);
  if (str.startsWith('data:image/')) return escapeHTML(str);
  return '';
};

export function printAgendamentoRecibo(params: {
  agendamento: Agendamento;
  cliente: { nome: string; telefone: string; email?: string };
  servico: { nome: string; descricao?: string };
  salonName?: string;
  logoUrl?: string;
}) {
  const { agendamento, cliente, servico, salonName, logoUrl } = params;
  const dataBR = new Date(`${agendamento.data}T${agendamento.hora}`);
  const dataStr = dataBR.toLocaleDateString('pt-BR');
  const horaStr = agendamento.hora.slice(0, 5);
  const valor = formatBRL(agendamento.valor);
  const valorPago = formatBRL(agendamento.valorPago || 0);
  const valorDevido = formatBRL(agendamento.valorDevido || 0);
  const forma = agendamento.formaPagamento === 'cartao' ? 'Cartão' :
                agendamento.formaPagamento === 'pix' ? 'PIX' :
                agendamento.formaPagamento === 'dinheiro' ? 'Dinheiro' : 'Fiado';
  const statusPagamento = agendamento.statusPagamento === 'pago' ? 'Pago' :
                          agendamento.statusPagamento === 'parcial' ? 'Parcial' : 'Em aberto';

  const produtoAgendamentoOnline = (() => {
    if (!agendamento.observacoes || !agendamento.observacoes.includes('Compra de produto:')) return null;
    try {
      const jsonStr = agendamento.observacoes.split('Compra de produto:')[1].trim();
      const parsed = JSON.parse(jsonStr);
      return {
        produto_nome: escapeHTML(parsed?.produto_nome ?? ''),
        valor_total: formatBRL(parsed?.valor_total ?? 0),
        quantidade: escapeHTML(String(parsed?.quantidade ?? 0)),
        forma_pagamento_produto: escapeHTML(parsed?.forma_pagamento_produto ?? ''),
      };
    } catch {
      return null;
    }
  })();

  const win = window.open('', '_blank', 'noopener,noreferrer');
  if (!win) return;

  const style = `
    * { box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #1a1a1a; line-height: 1.4; }
    .container { max-width: 400px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { display: flex; flex-direction: column; align-items: center; gap: 8px; margin-bottom: 20px; text-align: center; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px; }
    .logo { width: 70px; height: 70px; border-radius: 20px; object-fit: cover; border: 3px solid #e9d5ff; margin-bottom: 5px; }
    .title { font-size: 20px; font-weight: 800; color: #7e22ce; letter-spacing: -0.5px; }
    .subtitle { font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    .section { margin-top: 20px; }
    .section h3 { font-size: 12px; margin: 0 0 10px 0; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 800; }
    .row { display: flex; justify-content: space-between; font-size: 13px; padding: 8px 0; border-bottom: 1px solid #f8fafc; }
    .row.total { border-top: 2px solid #f0f0f0; border-bottom: none; margin-top: 10px; padding-top: 12px; font-weight: 800; font-size: 16px; color: #7e22ce; }
    .row.detail { font-size: 11px; color: #64748b; border-bottom: none; padding: 2px 0; }
    .product-box { background: #fdf4ff; border: 1px solid #fae8ff; border-radius: 12px; padding: 12px; margin-top: 10px; }
    .product-title { font-size: 13px; font-weight: 700; color: #a21caf; margin-bottom: 4px; display: flex; justify-content: space-between; }
    .product-info { font-size: 11px; color: #c026d3; font-weight: 600; }
    .footer { margin-top: 25px; font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 15px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
    .badge-success { background: #dcfce7; color: #166534; }
    .badge-pending { background: #fee2e2; color: #991b1b; }
    @media print { body { padding: 0; } .container { box-shadow: none; border: none; } }
  `;

  const safeLogo = safeAttribute(logoUrl);
  const servicoValor = produtoAgendamentoOnline
    ? formatBRL(Math.max(0, Number(agendamento.valor) - Number((agendamento.valor - (produtoAgendamentoOnline ? 0 : 0)))))
    : null;
  const html = `
    <html>
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' data:; img-src 'self' data: https:; script-src 'unsafe-inline'"/>
        <title>Recibo - ${escapeHTML(salonName || 'ZALU')}</title>
        <style>${style}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            ${safeLogo ? `<img class="logo" src="${safeLogo}" alt="" />` : ''}
            <div>
              <div class="title">${escapeHTML(salonName || 'ZALU')}</div>
              <div class="subtitle">Comprovante de Atendimento</div>
            </div>
          </div>

          <div class="section">
            <h3>Cliente</h3>
            <div class="row"><div>Nome</div><div>${escapeHTML(cliente.nome)}</div></div>
            <div class="row"><div>Telefone</div><div>${escapeHTML(cliente.telefone)}</div></div>
          </div>

          <div class="section">
            <h3>Detalhes do Serviço</h3>
            <div class="row"><div>Procedimento</div><div>${escapeHTML(servico.nome)}</div></div>
            <div class="row"><div>Data e Hora</div><div>${escapeHTML(dataStr)} às ${escapeHTML(horaStr)}</div></div>
          </div>

          ${produtoAgendamentoOnline ? `
          <div class="section">
            <h3>Produtos Adquiridos</h3>
            <div class="product-box">
              <div class="product-title">
                <span>${produtoAgendamentoOnline.produto_nome}</span>
                <span>${produtoAgendamentoOnline.valor_total}</span>
              </div>
              <div class="product-info">Quantidade: ${produtoAgendamentoOnline.quantidade}x • Pagamento: ${produtoAgendamentoOnline.forma_pagamento_produto}</div>
            </div>
          </div>
          ` : ''}

          <div class="section">
            <h3>Resumo Financeiro</h3>
            <div class="row total"><div>Total Geral</div><div>${escapeHTML(valor)}</div></div>
            <div class="row"><div>Valor Pago</div><div>${escapeHTML(valorPago)}</div></div>
            <div class="row"><div>Pendente</div><div style="color: ${agendamento.valorDevido > 0 ? '#ef4444' : '#22c55e'}">${escapeHTML(valorDevido)}</div></div>
            <div class="row">
              <div>Status</div>
              <div><span class="badge ${agendamento.statusPagamento === 'pago' ? 'badge-success' : 'badge-pending'}">${escapeHTML(statusPagamento)}</span></div>
            </div>
          </div>

          <div class="footer">
            Obrigado pela preferência!<br>
            Documento gerado em ${escapeHTML(new Date().toLocaleString('pt-BR'))}<br>
            ${escapeHTML(window.location.origin)}
          </div>
        </div>
      </body>
    </html>
  `;

  const safeHtml = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  win.document.open();
  win.document.write(safeHtml);
  win.document.close();
  try { win.focus(); } catch {}
  const t1 = window.setTimeout(() => {
    try { win.print(); } catch {}
    const t2 = window.setTimeout(() => { try { win.close(); } catch {} }, 600);
    try { win.addEventListener && win.addEventListener('afterprint', () => { try { clearTimeout(t2); win.close(); } catch {} }); } catch {}
  }, 500);
}
