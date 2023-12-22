import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Ensure this is set in your environment

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Please provide Supabase URL and Service Role Key: " +
      supabaseUrl +
      " " +
      supabaseServiceRoleKey
  );
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
