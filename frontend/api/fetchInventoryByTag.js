// fetchInventoryByTag.js
import { query } from './db.js';
import { NextResponse } from 'next/server';

const buildQuery = (filters) => {
  // Specify which columns are stored as arrays in the database 
  // (PLEASE DON'T CHANGE THE DATABASE EVER AGAIN *praying bufo*)
  const arrayColumns = ['color', 'season', 'time_period', 'condition'];
  
  let baseQuery = "SELECT * FROM dummy_data WHERE 1=1";
  let queryParams = [];
  let paramIndex = 1;

  for (const [key, values] of Object.entries(filters)) {
    // Skip empty arrays and NOT NULL values
    if (values === "NOT NULL" || !Array.isArray(values) || values.length === 0) {
      continue;
    }

    if (arrayColumns.includes(key)) {
      // Handle array columns using ANY
      baseQuery += ` AND (`;
      const conditions = values.map((_, index) => {
        const currentParam = paramIndex + index;
        return `$${currentParam} = ANY(${key})`;
      });
      baseQuery += conditions.join(" OR ");
      baseQuery += ")";
    } else {
      // Handle regular string/int columns using IN
      baseQuery += ` AND ${key} IN (`;
      const placeholders = values.map((_, index) => `$${paramIndex + index}`).join(", ");
      baseQuery += placeholders + ")";
    }
    
    // Add all values to params array
    queryParams.push(...values);
    paramIndex += values.length;
  }

  return { finalQuery: baseQuery, values: queryParams };
};
export async function POST(request) {
  try {
    const filters = await request.json();
    
    if (!filters || typeof filters !== 'object') {
      return NextResponse.json(
        { error: 'Invalid filters format' },
        { status: 400 }
      );
    }

    const { finalQuery, values } = buildQuery(filters);
    const result = await query(finalQuery, values);
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}