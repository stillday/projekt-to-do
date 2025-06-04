import { createClient } from '@supabase/supabase-js';

// Achtung: Diese Datei nur auf dem Server verwenden!
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Umgebungsvariablen PUBLIC_SUPABASE_URL oder PUBLIC_SUPABASE_ANON_KEY fehlen.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
