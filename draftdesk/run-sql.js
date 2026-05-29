import pg from 'pg';

const connectionString = "postgresql://postgres:3ef8719693210cca3f48855b26c63f67@swkc8nwa.ap-southeast.database.insforge.app:5432/insforge?sslmode=require";
const client = new pg.Client({ connectionString });

async function run() {
  try {
    await client.connect();
    
    // Drop all previous policies on storage.objects to avoid conflicts
    await client.query(`
      DROP POLICY IF EXISTS "Public Access to Thumbnails" ON storage.objects;
      DROP POLICY IF EXISTS "Auth Upload Thumbnails" ON storage.objects;
      DROP POLICY IF EXISTS "Auth Update Thumbnails" ON storage.objects;
      DROP POLICY IF EXISTS "Auth Delete Thumbnails" ON storage.objects;
      DROP POLICY IF EXISTS "Allow All Storage" ON storage.objects;
    `);

    // Create one master permissive policy for debugging
    await client.query(`
      CREATE POLICY "Allow All Storage" 
      ON storage.objects FOR ALL 
      USING (true) WITH CHECK (true);
    `);
    
    console.log('Applied master permissive policy!');
  } catch (err) {
    console.error(err.message);
  } finally {
    await client.end();
  }
}

run();
