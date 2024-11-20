import { query } from './db.js';
export default async function getFirstTwoBorrowedItems() {
    try {
      // Query to select the first two items with 'Borrowed' status
      const result = await query(
        'SELECT id, status, borrower_history, approver_info FROM dummy_data WHERE status = $1 LIMIT 2', 
        ['Borrowed']
      );

      //Query to select all items with 'Borrowed' status
        // const result = await query(
        //     'SELECT id, status, borrower_history, approver_info FROM dummy_data WHERE status = $1', 
        //     ['Borrowed']
        // );
  
      // Check if any borrowed items exist
      if (result.rows.length === 0) {
        return {
          message: 'No borrowed items found.',
          borrowedItems: []
        };
      }
  
      // Transform the results into a more readable format
      const borrowedItems = result.rows.map(item => ({
        id: item.id,
        status: item.status,
        borrowerHistory: item.borrower_history ? item.borrower_history[item.borrower_history.length - 1] : null,
        approverInfo: item.approver_info
      }));
  
      return {
        message: `Found ${result.rows.length} borrowed item(s)`,
        borrowedItems: borrowedItems
      };
  
    } catch (error) {
      console.error("Database query error:", error);
      throw new Error('Failed to retrieve borrowed items');
    }
  }