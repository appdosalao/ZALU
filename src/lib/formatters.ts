const brlCurrencyFmt = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export const formatBRL = (value: number | null | undefined): string => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return brlCurrencyFmt.format(0);
  }
  return brlCurrencyFmt.format(value);
};

export const formatNumberBR = (
  value: number | null | undefined,
  fractionDigits: number = 2,
): string => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return (0).toLocaleString('pt-BR', { minimumFractionDigits: fractionDigits });
  }
  return value.toLocaleString('pt-BR', { minimumFractionDigits: fractionDigits });
};

export const formatDateBR = (
  date: string | Date | null | undefined,
  withTime: boolean = false,
): string => {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '-';
  return withTime
    ? d.toLocaleString('pt-BR')
    : d.toLocaleDateString('pt-BR');
};

export const formatDateTimeBR = (date: string | Date | null | undefined): string =>
  formatDateBR(date, true);

export const formatTime = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

export const normalizeText = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

export const searchMatches = (haystack: string, needle: string): boolean => {
  if (!needle) return true;
  if (!haystack) return false;
  return normalizeText(haystack).includes(normalizeText(needle));
};

export const capitalizeFirst = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
