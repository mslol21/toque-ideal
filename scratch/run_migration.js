const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const connectionString = 'postgresql://postgres:sqdIrWgKVn21@db.unnskpqpnmpxenzfxesb.supabase.co:5432/postgres';

async function runMigration() {
  console.log('Connecting to Supabase PostgreSQL database...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected successfully to PostgreSQL!');

    const schemaSql = fs.readFileSync(path.join(__dirname, '../supabase/schema.sql'), 'utf8');
    console.log('Executing schema.sql...');

    await client.query(schemaSql);
    console.log('Schema.sql migration executed successfully!');

    // Verify created tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);
    console.log('Public tables in Supabase:', res.rows.map(r => r.table_name));

  } catch (err) {
    console.error('Error during migration:', err);
  } finally {
    await client.end();
  }
}

runMigration();
