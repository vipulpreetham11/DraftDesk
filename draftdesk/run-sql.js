import pg from 'pg';

const connectionString = "postgresql://postgres:3ef8719693210cca3f48855b26c63f67@swkc8nwa.ap-southeast.database.insforge.app:5432/insforge?sslmode=require";
const client = new pg.Client({ connectionString });

async function run() {
  try {
    await client.connect();
    
    await client.query(`
      ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ai_generations_count integer DEFAULT 0;
    `);
    
    console.log('Applied ai_generations_count migration!');
  } catch (err) {
    console.error(err.message);
  } finally {
    await client.end();
  }
}

run();
