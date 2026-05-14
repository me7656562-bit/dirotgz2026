// Cleans the failed _prisma_migrations table so we can switch to `prisma db push`
// Safe to run multiple times - only drops the migration tracking table.

const { Pool } = require('pg');

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.log('No DATABASE_URL found, skipping cleanup');
    return;
  }

  const pool = new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('Cleaning up _prisma_migrations table...');
    await pool.query('DROP TABLE IF EXISTS "_prisma_migrations" CASCADE');
    console.log('Cleanup successful');
  } catch (err) {
    console.error('Cleanup failed (non-fatal):', err.message);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Script error (non-fatal):', err);
  process.exit(0);
});
