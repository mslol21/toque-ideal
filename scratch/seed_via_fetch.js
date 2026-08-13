const supabaseUrl = 'https://unnskpqpnmpxenzfxesb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVubnNrcHFwbm1weGVuemZ4ZXNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1NzU2OTEsImV4cCI6MjEwMjE1MTY5MX0.WiwtqKuYFO53-wmyj2mq9Sma6-fgFpRzUaAA3eqwPJk';

async function testFetch() {
  console.log('Testing direct REST API query to Supabase...');
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/categories?select=*`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    console.log('HTTP Status:', res.status);
    const body = await res.json();
    console.log('Response body:', body);
  } catch (e) {
    console.error('Fetch error:', e);
  }
}

testFetch();
