import { toast } from 'sonner';

export function validateUniqueName<T extends { nome?: string; id?: string }>(
  items: T[],
  candidateName: string,
  entityLabel: string,
  excludedId?: string,
): boolean {
  const candidateTrimmed = candidateName.trim().toLowerCase();

  const duplicate = items.find((item) => {
    if (excludedId !== undefined && item.id === excludedId) return false;
    const itemName = item.nome?.trim().toLowerCase();
    return itemName === candidateTrimmed;
  });

  if (duplicate) {
    toast.error(`Já existe um ${entityLabel} com este nome`);
    return false;
  }

  return true;
}
