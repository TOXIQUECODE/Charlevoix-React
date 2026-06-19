// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pbtctfmxtuhdlgkhhjvz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBidGN0Zm14dHVoZGxna2hoanZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MDU5NDQsImV4cCI6MjA5NzI4MTk0NH0.m7LWZcUvzixIfJFGql8RDj9aoSLX7d_PzO1VJtYmcck';

export const supabase = createClient(supabaseUrl, supabaseKey);