const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://unnskpqpnmpxenzfxesb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVubnNrcHFwbm1weGVuemZ4ZXNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1NzU2OTEsImV4cCI6MjEwMjE1MTY5MX0.WiwtqKuYFO53-wmyj2mq9Sma6-fgFpRzUaAA3eqwPJk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase client connection...');
  const { data, error } = await supabase.from('categories').select('*');
  if (error) {
    console.log('Categories table notice (not yet created via SQL Editor or auto-created):', error.message);
  } else {
    console.log('Categories found in live Supabase:', data);
  }
}

testConnection();
