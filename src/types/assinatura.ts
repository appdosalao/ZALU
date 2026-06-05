export interface Assinatura {
  id: string;
  usuario_id: string;
  plan_type: 'mensal' | 'vitalicio' | null;
  subscription_status: 'trial' | 'active' | 'expired' | 'inactive' | null;
  trial_start_date: string | null;
  trial_used: boolean | null;
  payment_provider: string | null;
  cakto_order_id: string | null;
  cakto_order_ref_id: string | null;
  cakto_product_id: string | null;
  cakto_offer_id: string | null;
  cakto_subscription_id: string | null;
  cakto_last_event: string | null;
  cakto_last_status: string | null;
  cakto_customer_email: string | null;
  subscription_updated_at: string | null;
  paid_access: boolean;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}
