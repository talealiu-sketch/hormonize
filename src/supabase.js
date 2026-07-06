import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://abcdefghijk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1peGxycGZsYmZoamRhc3RlaWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzNDM3MjEsImV4cCI6MjA5ODkxOTcyMX0.ytUQ6FQQFahHKHdeq52XZQ4BeV92mS7Eomlera90T8o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);