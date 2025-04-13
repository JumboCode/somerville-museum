import { query } from './db.js';

export async function borrowHandler(req, res) {
  let message; 

  const { dateBorrowed, borrowerName, borrowerEmail, phoneNumber, dueDate, 
          approver, note, selectedItems } = req.body;
   
  if (selectedItems == 0) {
    message = "No items selected."
    res.status(200).json({message}); 
    return;
  }
        
  try {
    // Check for existing borrower
    const existingBorrowerResult = await query(
      `SELECT * FROM borrowers where email = $1`, [borrowerEmail]
    );

    let borrowerId; 
 
    // If borrower doesn't exist, create new borrower
    if (existingBorrowerResult.rows.length > 0) {
      borrowerId = existingBorrowerResult.rows[0].id; 
    } else {
      const newBorrowerResult = await query(
        `INSERT INTO borrowers (name, email, phone_number) VALUES ($1, $2, $3) RETURNING id`,
        [borrowerName, borrowerEmail, phoneNumber]
      );
      borrowerId = newBorrowerResult.rows[0].id;
    }
    
    for (const itemId of selectedItems) {
      // Check if there's an existing active borrow for this item
      const existingBorrowResult = await query(
        'SELECT id FROM borrows WHERE item_id = $1 AND date_returned IS NULL',
        [itemId]
      );
      
      if (existingBorrowResult.rows.length > 0) {
        const borrowId = existingBorrowResult.rows[0].id;
        await query(
          'UPDATE borrows SET borrower_id = $1, date_borrowed = $2, return_date = $3, approver = $4, notes = $5 WHERE id = $6',
          [borrowerId, dateBorrowed, dueDate, approver, note, borrowId]
        );
      } else {

        await query(
          'INSERT INTO borrows (borrower_id, item_id, date_borrowed, return_date, date_returned, approver, notes) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [borrowerId, itemId, dateBorrowed, dueDate, null, approver, note]
        );
      }
      
      // Update dummy_data
      await query(
        `UPDATE dummy_data SET status = $1, current_borrower = $2 WHERE id = $3`,
        ['Borrowed', borrowerId, itemId]
      );
    }

    message = 'Borrowing process completed. ';
    res.status(200).json({ message });

  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function returnHandler(req, res) {
  const { selectedItems } = req.body;
  const { notes_id } = req.body;
  const { notes_content } = req.body;

  try {
    // Arrays to keep track of items 
    const invalidItems = [];
    const validItems = []; 

    // Update notes when it changes
    for (let i = 0; i < notes_content.length; i++) {
      // Check status of each item 
      const statusResult = await query(
        'SELECT current_borrower FROM dummy_data WHERE id = $1', [notes_id[i]] 
      ); 
      const curr_borrower = statusResult.rows[0].current_borrower;
      
      // Update notes in borrows table 
      await query(
        "UPDATE borrows SET notes = $1 WHERE borrower_id = $2 AND item_id = $3 AND date_returned IS NULL",
        [notes_content[i], curr_borrower, notes_id[i]]
      );
    }

    for (const itemId of selectedItems) {
      // Get current borrower from dummy_data for this item
      const borrowerResult = await query(
        'SELECT current_borrower FROM dummy_data WHERE id = $1',
        [itemId]
      );
      
      if (borrowerResult.rows.length === 0 || !borrowerResult.rows[0].current_borrower) {
        invalidItems.push(itemId);
        continue;
      }
      
      const currentBorrower = borrowerResult.rows[0].current_borrower;
      
      // Update date_returned in borrows table
      await query(
        "UPDATE borrows SET date_returned = $1 WHERE borrower_id = $2 AND item_id = $3 AND date_returned IS NULL",
        [Intl.DateTimeFormat("en-US").format(new Date()), currentBorrower, itemId]
      );

      // Update dummy_data - set status to Available and current_borrower to NULL
      await query(
        'UPDATE dummy_data SET status = $1, current_borrower = NULL WHERE id = $2', 
        ['Available', itemId]
      );

      validItems.push(itemId);
    }
    
    let message = 'Returning process completed. ';

    if (validItems.length > 0) {
      message += `Successfully returned items ${validItems.join(', ')}. `;
    }
    if (invalidItems.length > 0) {
      message += `The following items were unable to be returned: ${invalidItems.join(', ')}. `;
    }

    res.status(200).json({message});
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function borrowValidityHandler(req, res) {
  const { selectedItems } = req.body;

  try {
    // Arrays to keep track of items
    const availableItems = [];
    const unavailableItems = [];

    for (const itemId of selectedItems) {
      // Query the status of each item
      const statusResult = await query(
        'SELECT * FROM dummy_data WHERE id = $1',
        [itemId]
      );

      const itemDetails = statusResult.rows[0]; // Get item details

      if (!itemDetails) {
        // Handle case where the item doesn't exist in the database
        unavailableItems.push({ id: itemId, reason: "Item not found" });
        continue;
      }

      // If the item is not available, add to unavailable items
      if (itemDetails.status !== 'Available') {
        unavailableItems.push(itemDetails);
        continue; // Skip to the next item
      }

      // Add the item to available items
      availableItems.push(itemDetails);
    }

    // Build the response message
    let message = '';
    if (unavailableItems.length > 0) {
      message += `${unavailableItems
        .map((item) => `${item.id}`)
        .join(', ')} `;
    }

    // Send the response
    res.status(200).json({
      message,
      availableItems,
      unavailableItems,
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function returnValidityHandler(req, res) {
  const { selectedItems } = req.body;

  try {
    // Arrays to keep track of items
    const availableItems = [];
    const unavailableItems = [];

    for (const itemId of selectedItems) {
      // Query the status of each item
      const statusResult = await query(
        'SELECT * FROM dummy_data WHERE id = $1',
        [itemId]
      );

      const itemDetails = statusResult.rows[0]; // Get item details

      if (!itemDetails) {
        // Handle case where the item doesn't exist in the database
        unavailableItems.push({ id: itemId, reason: "Item not found" });
        continue;
      }

      // If the item is not borrowed, add to unavailable items
      if (itemDetails.status !== 'Borrowed') {
        unavailableItems.push(itemDetails);
        continue; // Skip to the next item
      }

      // Add the item to available items
      availableItems.push(itemDetails);
    }

    // Build the response message
    let message = '';
    if (unavailableItems.length > 0) {
      message += `${unavailableItems
        .map((item) => `${item.id}`)
        .join(', ')}. `;
    }

    // Send the response
    res.status(200).json({
      message,
      availableItems,
      unavailableItems,
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function borrowByDateRangeHandler(req, res) {
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
      'SELECT b.*, d.name as item_name, br.name as borrower_name FROM borrows b ' +
      'JOIN dummy_data d ON b.item_id = d.id ' +
      'JOIN borrowers br ON b.borrower_id = br.id ' +
      'WHERE TO_DATE(b.return_date, \'MM/DD/YYYY\') BETWEEN TO_DATE($1, \'YYYY-MM-DD\') AND TO_DATE($2, \'YYYY-MM-DD\')',
      [formattedStartDate, formattedEndDate]
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function fetchBorrowerEmailHandler(req, res) {
  const { id } = req.query;  // Get borrower ID from query params

  if (!id) {
      return res.status(400).json({ error: "Missing borrower ID" });
  }

  try {
      // Fetch the borrower email using the ID
      const result = await query(`
          SELECT email FROM borrowers WHERE id = $1
      `, [id]);

      if (result.rows.length === 0) {
          return res.status(404).json({ error: "Borrower not found" });
      }

      res.status(200).json({ borrower_email: result.rows[0].email });
  } catch (error) {
      console.error("Error fetching borrower email:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
}


export async function overdueHandler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Get the current date
    const currentDate = new Date().toISOString();

    // SQL query to find all items with a return date passed
    const overdueQuery = `
      UPDATE dummy_data d
      SET status = 'Overdue'
      FROM borrows b
      WHERE b.item_id = d.id
      AND d.status = 'Borrowed'
      AND TO_DATE(b.return_date, 'MM/DD/YYYY') < CURRENT_DATE
      AND b.date_returned IS NULL
    `;

    // Execute the query
    const result = await query(overdueQuery);

    // Send response with the number of updated records
    res.status(200).json({ message: `${result.rowCount} items updated to overdue` });
  } catch (error) {
    console.error('Error updating overdue items:', error);
    res.status(500).json({ error: 'Failed to update overdue items' });
  }
}

// New method to get borrowing history for an item
export async function getItemBorrowHistoryHandler(req, res) {
  const { id } = req.query; // Item ID
  
  if (!id) {
    return res.status(400).json({ error: "Missing item ID" });
  }
  
  try {
    const result = await query(`
      SELECT b.*, br.name as borrower_name, br.email as borrower_email
      FROM borrows b
      JOIN borrowers br ON b.borrower_id = br.id
      WHERE b.item_id = $1
      ORDER BY b.id DESC
    `, [id]);
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching item borrow history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// New method to get borrowing history for a borrower
export async function getBorrowerHistoryHandler(req, res) {
  const { id } = req.query; // Borrower ID
  
  if (!id) {
    return res.status(400).json({ error: "Missing borrower ID" });
  }
  
  try {
    const result = await query(`
      SELECT b.*, d.name as item_name, d.id as item_id
      FROM borrows b
      JOIN dummy_data d ON b.item_id = d.id
      WHERE b.borrower_id = $1
      ORDER BY b.id DESC
    `, [id]);
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching borrower history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export default async function handler(req, res) {
  const { action } = req.query;
  
  switch(action) {
      case 'borrow':
          return borrowHandler(req, res);
      case 'return':
          return returnHandler(req, res);
      case 'borrowValidity':
          return borrowValidityHandler(req, res);
      case 'returnValidity':
          return returnValidityHandler(req, res);
      case 'borrowByDateRange':
          return borrowByDateRangeHandler(req, res);
      case 'fetchBorrowerEmail':
          return fetchBorrowerEmailHandler(req, res);
      case 'overdue':
          return overdueHandler(req, res);
      case 'itemBorrowHistory':
          return getItemBorrowHistoryHandler(req, res);
      case 'borrowerHistory':
          return getBorrowerHistoryHandler(req, res);
      default:
          return res.status(400).json({ error: 'Invalid action' });
  }
}
