import type { Cronograma } from '@/types/cronograma';

const toUtcDate = (date: string) => {
  const [year, month, day] = date.slice(0, 10).split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

const formatUtcDate = (date: Date) => date.toISOString().slice(0, 10);

const addUtcDays = (date: Date, days: number) =>
  new Date(date.getTime() + days * 24 * 60 * 60 * 1000);

const addUtcMonthsFromAnchor = (anchor: Date, months: number) => {
  const year = anchor.getUTCFullYear();
  const month = anchor.getUTCMonth() + months;
  const day = anchor.getUTCDate();
  const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return new Date(Date.UTC(year, month, Math.min(day, lastDayOfMonth)));
};

export function getNextCronogramaDate(
  cronograma: Pick<Cronograma, 'data_inicio' | 'recorrencia' | 'intervalo_dias'>,
  afterDate: string,
): string {
  const anchor = toUtcDate(cronograma.data_inicio);
  const reference = toUtcDate(afterDate);

  if (cronograma.recorrencia === 'Mensal') {
    let months = Math.max(
      1,
      (reference.getUTCFullYear() - anchor.getUTCFullYear()) * 12
        + reference.getUTCMonth()
        - anchor.getUTCMonth(),
    );
    let next = addUtcMonthsFromAnchor(anchor, months);

    while (next <= reference) {
      months += 1;
      next = addUtcMonthsFromAnchor(anchor, months);
    }

    return formatUtcDate(next);
  }

  const intervalDays = cronograma.recorrencia === 'Quinzenal'
    ? 14
    : cronograma.recorrencia === 'Semanal'
      ? 7
      : cronograma.intervalo_dias;

  if (!intervalDays || intervalDays < 1) {
    throw new Error('Defina um intervalo válido para o cronograma.');
  }

  const elapsedDays = Math.floor((reference.getTime() - anchor.getTime()) / (24 * 60 * 60 * 1000));
  const occurrences = Math.max(1, Math.floor(elapsedDays / intervalDays) + 1);

  return formatUtcDate(addUtcDays(anchor, occurrences * intervalDays));
}
