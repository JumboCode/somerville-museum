import { query } from './db.js';

export default async function handler(req, res) {
  const { startDate, endDate } = req.body;
  
  try {
    // Parse dates to ensure correct format for comparison
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);
    
    // Format dates in ISO format for SQL query
    const formattedStartDate = parsedStartDate.toISOString().split('T')[0];
    const formattedEndDate = parsedEndDate.toISOString().split('T')[0];
    
    // Query items with return dates within the specified range
    const result = await query(
      'SELECT * FROM borrows WHERE TO_DATE(return_date, \'MM/DD/YYYY\') BETWEEN TO_DATE($1, \'YYYY-MM-DD\') AND TO_DATE($2, \'YYYY-MM-DD\')',
      [formattedStartDate, formattedEndDate]
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}