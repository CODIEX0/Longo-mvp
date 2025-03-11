import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ajfpzpdlhadxwbklyjrq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZnB6cGRsaGFkeHdia2x5anJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NjQwNTIsImV4cCI6MjA1NzA0MDA1Mn0.ErsNzxuuLab287Rqign0F081kmDDF3dT8IfUKGrevFM';
export const supabase = createClient(supabaseUrl, supabaseKey); 