import { createClient } from "@supabase/supabase-js";

export const Supabase = createClient(
    "https://xvadtnodmssamnbxyjur.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2YWR0bm9kbXNzYW1uYnh5anVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTkwMjQsImV4cCI6MjA2NjA5NTAyNH0.Bh-GmrZwPNIJKbBx7re0AFTdzDinuVPLTnUaAupHa9Q"
);
