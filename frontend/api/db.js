/**
 * @fileoverview Simple full base query of the database's items with parameters
 *               for additional filtering.
 * 
 * @file api/db.js
 * @date 16 February, 2025
 * @authors Zack White
 *  
 */

import pg from 'pg';
const { Pool } = pg;
import 'dotenv/config';

// We are using pooled connections because we are using serverless functions
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10, // maximum number of connections in the pool
  idleTimeoutMillis: 30000, // close idle connections after 30 seconds
});

// Utility function to query the database using the pool
export async function query(text, params) {
  const client = await pool.connect();
  const result = client.query("SELECT * from dummy_data");

  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release(); // return the client to the pool
  }
}

export default async function handler(req, res) {
  const text = req.body.text;
  const params = req.body.params;

  try {
    const result = await query(text, params);
    res.status(200).json(result.rows);
  } catch(error) {
    console.error('database query error: ', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
}