export const parseApiResponse = async <T,>(response: Response): Promise<T> => {
  const body = await response.text();
  let payload: unknown;

  try {
    payload = JSON.parse(body) as unknown;
  } catch {
    if (/^\s*<!doctype html|^\s*<html/i.test(body)) {
      throw new Error(
        `A API retornou uma página HTML em vez de JSON (HTTP ${response.status}). Verifique se o deploy da função /api/index foi concluído na Vercel.`
      );
    }
    throw new Error(`A API retornou uma resposta inválida (HTTP ${response.status}).`);
  }

  if (!response.ok) {
    const message =
      typeof payload === 'object' &&
      payload !== null &&
      'message' in payload &&
      typeof payload.message === 'string'
        ? payload.message
        : `A operação falhou (HTTP ${response.status}).`;
    throw new Error(message);
  }

  return payload as T;
};
