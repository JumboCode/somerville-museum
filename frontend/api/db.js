// frontend/api/db.js
import pg from 'pg';
const { Pool } = pg;
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10, // maximum number of connections in the pool
  idleTimeoutMillis: 30000, // close idle connections after 30 seconds
});

// Utility function to query the database using the pool
export async function query(text, params) {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release(); // return the client to the pool
  }
}
