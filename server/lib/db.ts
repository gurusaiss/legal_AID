import pg from "pg";

const { Pool } = pg;

let _pool: pg.Pool | null = null;

/** Returns a singleton pg Pool, or null if DATABASE_URL is not configured. */
export function getDb(): pg.Pool | null {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return null;
  if (!_pool) {
    _pool = new Pool({
      connectionString: url,
      ssl: { rejectUnauthorized: false }, // required for Neon
      max: 10,
    });
  }
  return _pool;
}
