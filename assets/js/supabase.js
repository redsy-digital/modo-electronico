// SUPABASE CONFIG
const SUPABASE_URL = "https://ygsdnhycqbgtcejzowlg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlnc2RuaHljcWJndGNlanpvd2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1Mzk0NDUsImV4cCI6MjA4NzExNTQ0NX0.oNyfky10TL1z_A77xALRSuhnT5yMiR-kWkgu4BzS3OI";

// Import via CDN (se não estiver usando build system)
const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

window.supabaseClient = supabaseClient;