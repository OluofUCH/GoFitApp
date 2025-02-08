import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://giuzfwdleogsfpsnphgs.supabase.co"; // Replace with your Supabase project URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdXpmd2RsZW9nc2Zwc25waGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5Mzc3MzMsImV4cCI6MjA1NDUxMzczM30.EIAv7aIeILgv-9AVGA1jff_aM4stJ8nYCTwOghvfv_M"; // Replace with your Supabase anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
