import type { Database, Json } from './types.js';

type Tables = Database['public']['Tables'];

type AffiliateProfile = {
  Row: {
    user_id: string;
    referral_code: string;
    commission_rate: number;
    active: boolean;
    created_at: string;
    updated_at: string;
  };
  Insert: {
    user_id: string;
    referral_code: string;
    commission_rate: number;
    active?: boolean;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    user_id?: string;
    referral_code?: string;
    commission_rate?: number;
    active?: boolean;
    created_at?: string;
    updated_at?: string;
  };
  Relationships: [];
};

type ReferralCommission = {
  Row: {
    id: string;
    affiliate_id: string;
    referred_user_id: string;
    payment_reference: string;
    payment_amount: number;
    commission_rate: number;
    commission_amount: number;
    status: 'pending' | 'paid' | 'cancelled';
    payment_received_at: string;
    paid_at: string | null;
    cancelled_at: string | null;
    created_at: string;
  };
  Insert: {
    id?: string;
    affiliate_id: string;
    referred_user_id: string;
    payment_reference: string;
    payment_amount: number;
    commission_rate: number;
    commission_amount: number;
    status?: 'pending' | 'paid' | 'cancelled';
    payment_received_at?: string;
    paid_at?: string | null;
    cancelled_at?: string | null;
    created_at?: string;
  };
  Update: {
    id?: string;
    affiliate_id?: string;
    referred_user_id?: string;
    payment_reference?: string;
    payment_amount?: number;
    commission_rate?: number;
    commission_amount?: number;
    status?: 'pending' | 'paid' | 'cancelled';
    payment_received_at?: string;
    paid_at?: string | null;
    cancelled_at?: string | null;
    created_at?: string;
  };
  Relationships: [];
};

type AffiliateSettings = {
  Row: {
    id: boolean;
    default_commission_rate: number;
    commission_mode: 'recurring' | 'first_payment';
    updated_at: string;
  };
  Insert: {
    id?: boolean;
    default_commission_rate?: number;
    commission_mode?: 'recurring' | 'first_payment';
    updated_at?: string;
  };
  Update: {
    id?: boolean;
    default_commission_rate?: number;
    commission_mode?: 'recurring' | 'first_payment';
    updated_at?: string;
  };
  Relationships: [];
};

type ExtendedUsuarios = Omit<Tables['usuarios'], 'Row' | 'Insert' | 'Update'> & {
  Row: Tables['usuarios']['Row'] & {
    is_divulgador: boolean;
    indicado_por: string | null;
  };
  Insert: Tables['usuarios']['Insert'] & {
    is_divulgador?: boolean;
    indicado_por?: string | null;
  };
  Update: Tables['usuarios']['Update'] & {
    is_divulgador?: boolean;
    indicado_por?: string | null;
  };
};

type PublicSchema = Omit<Database['public'], 'Tables' | 'Functions'> & {
  Tables: Omit<Tables, 'usuarios'> & {
    usuarios: ExtendedUsuarios;
    affiliate_profiles: AffiliateProfile;
    referral_commissions: ReferralCommission;
    affiliate_settings: AffiliateSettings;
  };
  Functions: Database['public']['Functions'] & {
    set_affiliate_profile: {
      Args: {
        p_user_id: string;
        p_active: boolean;
        p_referral_code?: string | null;
        p_commission_rate?: number | null;
      };
      Returns: AffiliateProfile['Row'];
    };
    record_referral_commission: {
      Args: {
        p_referred_user_id: string;
        p_payment_reference: string;
        p_payment_amount: number;
      };
      Returns: Json;
    };
    cancel_referral_commission: {
      Args: {
        p_referred_user_id: string;
        p_payment_reference: string | null;
      };
      Returns: number;
    };
  };
};

export type AffiliateDatabase = Omit<Database, 'public'> & {
  public: PublicSchema;
};
