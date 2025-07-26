const { createClient } = require('@supabase/supabase-js');

// Valida se as variáveis de ambiente estão presentes
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('[Supabase] ⚠️ Variáveis de ambiente SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configuradas.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
