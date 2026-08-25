export function limparTelefone(telefone: string): string {
  return (telefone || '').replace(/\D/g, '');
}

export function montarLinkWhatsApp(telefone: string, mensagem: string, prefixo = '55'): string {
  const numero = limparTelefone(telefone);
  const base = numero ? `https://wa.me/${prefixo}${numero}` : 'https://wa.me/';
  return `${base}?text=${encodeURIComponent(mensagem)}`;
}

export function abrirWhatsApp(telefone: string, mensagem: string, prefixo = '55'): void {
  window.open(montarLinkWhatsApp(telefone, mensagem, prefixo), '_blank');
}

export function montarCabecalhoSalao(nomeSalao?: string | null): string {
  return `${nomeSalao || 'Seu Salão'} • ${window.location.origin}`;
}
