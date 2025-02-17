
import { query } from './db'; 

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Get the current date
    const currentDate = new Date().toISOString();

    // SQL query to find all items with a return date passed
    const overdueQuery = `
      UPDATE borrow
      SET status = 'Overdue'
      WHERE return_date < $1 AND status != 'Overdue'
    `;

    // Execute the query, passing the current date
    const result = await query(overdueQuery, [currentDate]);

    // Send response with the number of updated records
    res.status(200).json({ message: `${result.rowCount} items updated to overdue` });
  } catch (error) {
    console.error('Error updating overdue items:', error);
    res.status(500).json({ error: 'Failed to update overdue items' });
  }
}
