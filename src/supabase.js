import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://txozehijfrgozqujicgq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4b3plaGlqZnJnb3pxdWppY2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2MDY4NjgsImV4cCI6MjA3ODE4Mjg2OH0._25McOaz94zftWLiZZDMhZJe6QF9aAcc2wCPsYS_0RU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
