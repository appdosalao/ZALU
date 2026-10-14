export const ADMIN_PLAN_CATALOG = [
  {
    productId: '7d2cec92-259e-4f35-b76f-9a5f0965340e',
    name: 'Essencial',
    monthlyRevenue: 14.9,
  },
  {
    productId: '287744c9-5bbc-4e77-aea6-ecd7bbe6392f',
    name: 'Profissional',
    monthlyRevenue: 27.9,
  },
  {
    productId: 'e2faa8cd-d1ff-4679-ae51-a7552f514eda',
    name: 'Trimestral',
    monthlyRevenue: 23.3,
  },
  {
    productId: '2a65ce9f-0efe-46a6-ab5a-e08f02b2ed2c',
    name: 'Anual',
    monthlyRevenue: 23.25,
  },
] as const;

const normalizeProductId = (productId: string | null | undefined) =>
  productId?.trim().replace(/^#/, '').toLowerCase() ?? '';

export const getAdminPlan = (productId: string | null | undefined) => {
  const normalizedId = normalizeProductId(productId);
  return ADMIN_PLAN_CATALOG.find((plan) => plan.productId === normalizedId);
};
