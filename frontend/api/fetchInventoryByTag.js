import { query } from './db.js';

// Builds the conditional query piece by piece depending on the state passed
const buildQuery = (filters) => {
  // Col names in db that accept arrays instead of regular text.  I hate this function
  const arrColumns = ["color", "season", "time_period", "condition"]
  let baseQuery = "SELECT * FROM dummy_data WHERE 1=1"; // Start with a true condition
  let queryParams = [];
  let index = 1; // For parameterized queries in PostgreSQL
  for (const [key, value] of Object.entries(filters)) {
      if (value === "NOT NULL") continue 
      else if (arrColumns.includes(key)) {  // Only include valid filters
          baseQuery += ` AND $${index} = ANY(${key})`;
      } else {
        baseQuery += ` AND "${key}" = $${index}`;
      }
      queryParams.push(value);
      index++;
  }

  return { finalQuery: baseQuery, values: queryParams };
};

export default async function handler(req, res) {
  const { finalQuery, values } = buildQuery(req.body)
  console.log(finalQuery, values);
  try {
      const result = await query(finalQuery, values);
      res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
