import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xnyamstpuqhworjhorjj.supabase.cohttps://your-project-id.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhueWFtc3RwdXFod29yamhvcmpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMDA3NzAsImV4cCI6MjA3MDc3Njc3MH0.SISpPGpFmn_LwItOoxJRI1odyPPGj0s3APkfa20Ewhs"; // From Supabase dashboard → API → anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
