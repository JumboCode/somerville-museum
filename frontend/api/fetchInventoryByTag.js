import { query } from './db.js';

const buildQuery = (filters) => {
  // Specify which columns are stored as arrays in the database
  const arrayColumns = ['color', 'season', 'time_period', 'condition'];

  let baseQuery = "SELECT * FROM dummy_data WHERE 1=1";
  let queryParams = [];
  let paramIndex = 1;

  for (const [key, values] of Object.entries(filters)) {
    if (values === "NOT NULL" || !Array.isArray(values) || values.length === 0) {
      continue;
    }

    if (arrayColumns.includes(key)) {
      baseQuery += ` AND (`;
      const conditions = values.map((_, index) => {
        return `$${paramIndex + index} = ANY(${key})`;
      });
      baseQuery += conditions.join(" AND ") + ")";
    } else {
      baseQuery += ` AND ${key} IN (${values.map((_, index) => `$${paramIndex + index}`).join(", ")})`;
    }

    queryParams.push(...values);
    paramIndex += values.length;
  }

  return { finalQuery: baseQuery, values: queryParams };
};

export async function POST(request) {
  try {
    const filters = await request.json();

    if (!filters || typeof filters !== 'object') {
      return new Response(JSON.stringify({ error: 'Invalid filters format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { finalQuery, values } = buildQuery(filters);
    const result = await query(finalQuery, values);

    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("DATABASE QUERY ERROR:", error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
