import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== 'undefined') {
        console.error("Supabase environment variables are MISSING! Check .env.local and make sure they start with NEXT_PUBLIC_");
    }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
