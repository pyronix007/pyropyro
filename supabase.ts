
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Ces valeurs doivent être configurées dans les variables d'environnement de Vercel/GitHub
const supabaseUrl = 'https://knggcydcpaayuyagqfcs.supabase.co';
const supabaseAnonKey = (typeof process !== 'undefined' && process.env.SUPABASE_ANON_KEY) || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
