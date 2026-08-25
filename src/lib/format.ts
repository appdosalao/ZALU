import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { safeToDate } from '@/lib/utils';

export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

export function formatarTelefone(telefone: string): string {
  const numeros = telefone.replace(/\D/g, '');
  if (numeros.length === 11) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  }
  return telefone;
}

export function formatarHora(hora: string): string {
  return hora.slice(0, 5);
}

export function formatarDuracao(duracao: number): string {
  const horas = Math.floor(duracao / 60);
  const minutos = duracao % 60;

  if (horas > 0 && minutos > 0) {
    return `${horas}h ${minutos}min`;
  } else if (horas > 0) {
    return `${horas}h`;
  } else {
    return `${minutos}min`;
  }
}

export function formatarData(data: string | Date, mascara = 'dd/MM/yyyy'): string {
  return format(new Date(data), mascara, { locale: ptBR });
}

export function formatarDataLonga(data: string | Date): string {
  return format(safeToDate(data), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}

export function formatarDataHora(data: string | Date): string {
  return format(new Date(data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

export function formatarDataHoraCurta(data: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(data));
}
