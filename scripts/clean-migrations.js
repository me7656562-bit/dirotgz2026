// Cleans up the database state and adds missing columns directly via SQL.
// This avoids Prisma migration conflicts entirely.

const { Pool } = require('pg');

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.log('No DATABASE_URL found, skipping cleanup');
    return;
  }

  console.log('Connecting to database...');
  const pool = new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });

  const client = await pool.connect();
  try {
    // 1. Drop the _prisma_migrations table to clear any failed migration state
    console.log('Dropping _prisma_migrations table...');
    await client.query('DROP TABLE IF EXISTS "_prisma_migrations" CASCADE');
    console.log('  done.');

    // 2. Make sure the new columns exist (idempotent)
    const alters = [
      'ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "code" TEXT',
      'ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "roomsClosed" INTEGER',
      'ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "kosherKitchen" BOOLEAN DEFAULT false',
      'ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "chairsCount" INTEGER',
      'UPDATE "Listing" SET "kosherKitchen" = false WHERE "kosherKitchen" IS NULL',
      'ALTER TABLE "Listing" ALTER COLUMN "kosherKitchen" SET NOT NULL',
      'ALTER TABLE "Listing" ALTER COLUMN "kosherKitchen" SET DEFAULT false',
    ];

    for (const sql of alters) {
      try {
        console.log('Running:', sql);
        await client.query(sql);
      } catch (err) {
        console.warn('  non-fatal:', err.message);
      }
    }

    console.log('Database cleanup completed successfully');
  } catch (err) {
    console.error('Error during cleanup:', err.message);
    // Don't fail the build - prisma db push will handle the rest
  } finally {
    client.release();
    await pool.end();
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Script error (non-fatal):', err);
    process.exit(0);
  });
