import { createClient } from '@supabase/supabase-js';
import { Database } from '../integrations/supabase/types.js';
import type { AffiliateDatabase } from '../integrations/supabase/affiliateTypes.js';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'test') {
  dotenv.config();
}

const supabaseUrl = process.env.SUPABASE_URL || "https://dfwepnzwktjyhvfmpuxo.supabase.co";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseServiceRoleKey) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY não encontrada nas variáveis de ambiente.');
}

export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export const supabaseAffiliateAdmin = createClient<AffiliateDatabase>(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
