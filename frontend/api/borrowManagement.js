/**
 * @fileoverview All API routes for managing borrow and return operations
 * 
 * @file api/borrowManagement.js
 * @date 16 February, 2025
 * @authors JumboCode Team
 *  
 */

import { query } from './db.js';

/* all backend logic for when an item is borrowed */
export async function borrowHandler(req, res) {
  let message; 
  
  // Check if request method is valid
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { dateBorrowed, borrowerName, borrowerEmail, phoneNumber, dueDate, 
          approver, note, selectedItems } = req.body;
   
  // Validate required fields
  if (!selectedItems || selectedItems.length === 0) {
    return res.status(400).json({message: "No items selected."}); 
  }

  if (!dateBorrowed || !borrowerName || !borrowerEmail || !dueDate) {
    return res.status(400).json({message: "Missing required fields."});
  }
        
  try {
    // Check for existing borrower
    const existingBorrowerResult = await query(
      `SELECT * FROM borrowers WHERE email = $1`, [borrowerEmail]
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
      
      if (!newBorrowerResult.rows || newBorrowerResult.rows.length === 0) {
        console.error('Failed to create new borrower - no ID returned');
        return res.status(500).json({ error: 'Failed to create borrower record' });
      }
      
      borrowerId = newBorrowerResult.rows[0].id;
    }
    
    // Track successfully processed items
    const processedItems = [];
    const failedItems = [];
    
    for (const itemId of selectedItems) {
      
      try {
        // Check if item is available
        const itemStatusResult = await query(
          'SELECT status FROM dummy_data WHERE id = $1',
          [itemId]
        );
        
        if (!itemStatusResult.rows || itemStatusResult.rows.length === 0) {
          console.error(`Item ${itemId} not found in database`);
          failedItems.push({ id: itemId, reason: 'Item not found' });
          continue;
        }
        
        const itemStatus = itemStatusResult.rows[0].status;
        if (itemStatus !== 'Available') {
          console.error(`Item ${itemId} is not available (current status: ${itemStatus})`);
          failedItems.push({ id: itemId, reason: `Item is ${itemStatus}` });
          continue;
        }
        
        // Always create a new borrow record for history purposes - let the database handle ID autoincrement
        const insertResult = await query(
          'INSERT INTO borrows (borrower_id, item_id, date_borrowed, return_date, date_returned, approver, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
          [borrowerId, itemId, dateBorrowed, dueDate, null, approver, note]
        );
        
        if (!insertResult.rows || insertResult.rows.length === 0) {
          console.error(`Failed to create borrow record for item ${itemId}`);
          failedItems.push({ id: itemId, reason: 'Database insert failed' });
          continue;
        }
        
        const newBorrowId = insertResult.rows[0].id;
        
        // Update dummy_data
        const updateResult = await query(
          `UPDATE dummy_data SET status = $1, current_borrower = $2 WHERE id = $3 RETURNING id`,
          ['Borrowed', borrowerId, itemId]
        );
        
        if (!updateResult.rows || updateResult.rows.length === 0) {
          console.error(`Failed to update item status for ${itemId}`);
          failedItems.push({ id: itemId, reason: 'Status update failed' });
          
          // Attempt to rollback the borrow record since item status update failed
          await query(
            'DELETE FROM borrows WHERE id = $1',
            [newBorrowId]
          );
          continue;
        }
        
        processedItems.push({
          itemId: itemId,
          borrowId: newBorrowId
        });
      } catch (itemError) {
        console.error(`Error processing item`, itemError);
        failedItems.push({ id: itemId, reason: 'Processing error' });
      }
    }

    // Build appropriate response message
    if (processedItems.length > 0) {
      message = `Successfully borrowed ${processedItems.length} item(s). `;
      
      if (failedItems.length > 0) {
        message += `Failed to borrow ${failedItems.length} item(s).`;
      }
      
      res.status(200).json({ 
        message, 
        success: true, 
        processedItems,
        failedItems 
      });
    } else {
      message = 'Failed to borrow any items.';
      res.status(400).json({ 
        message, 
        success: false,
        failedItems 
      });
    }

  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}

/* all backend logic for when an item is returned */
export async function returnHandler(req, res) {
  const { selectedItems } = req.body;
  const { notes_id } = req.body;
  const { notes_content } = req.body;

  if (!Array.isArray(notes_content)) {
    console.error('notes_content is not an array');
    return res.status(400).json({ error: 'notes_content must be an array' });
  }

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

/* check if the selected items can be borrowed */
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

/* check if the selected items can be returned */
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
      if (itemDetails.status == 'Available') {
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

/* handle return logic like emails with a bunch of items by their borrower */
export async function groupReturnsByBorrowerHandler(req, res) {
  const { returnedItems } = req.body;

  if (!returnedItems || returnedItems.length === 0) {
    return res.status(400).json({ error: "No items provided for return." });
  }

  try {
    const result = await query(`
      SELECT b.name AS borrower_name, 
             b.email AS borrower_email,
             d.id AS item_id, 
             d.name AS item_name
      FROM dummy_data d
      JOIN borrowers b ON d.current_borrower = b.id
      WHERE d.id = ANY($1::int[])
    `, [returnedItems]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No matching items or borrowers found." });
    }

    const groupedReturns = result.rows.reduce((acc, row) => {
      const borrowerKey = `${row.borrower_name} (${row.borrower_email})`;
      if (!acc[borrowerKey]) acc[borrowerKey] = [];
      acc[borrowerKey].push(row.item_name);
      return acc;
    }, {});

    // Send email to each borrower
    for (const key of Object.keys(groupedReturns)) {
      const matches = key.match(/^(.*) \((.*)\)$/);
      const borrowerName = matches ? matches[1] : 'Unknown';
      const borrowerEmail = matches ? matches[2] : 'Unknown';

      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/email?emailType=sendReturnEmail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          borrower_name: borrowerName,
          borrower_email: borrowerEmail,
          returned_items: groupedReturns[key],
        }),
      });
    }

    res.status(200).json({ success: true, message: 'Emails sent to all borrowers.' });

  } catch (error) {
    console.error('Error grouping returns by borrower:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/* update all items to be overdue once their date has passed */
/* done through crons job in vercel.json */
export async function overdueHandler(req, res) {

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

/* query all borrowers based off search parameters */
export async function searchBorrowersHandler(req, res) {
  const { ask } = req.body;

  try {
    const result = await query(
      `SELECT id, name, email, phone_number FROM borrowers 
       WHERE id::text ILIKE $1
       OR name ILIKE $1
       OR email ILIKE $1
       OR phone_number ILIKE $1`,
      [`%${ask}%`]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/* get a borrower's history */
export async function getBorrowerHistoryHandler(req, res) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: "Missing borrower ID" });
  }
  
  try {
    const result = await query(`
      SELECT 
        b.id,
        b.item_id,
        d.name as item_name,
        b.date_borrowed,
        b.return_date,
        b.date_returned,
        b.notes,
        b.approver
      FROM borrows b
      JOIN dummy_data d ON b.item_id = d.id
      WHERE b.borrower_id = $1
      ORDER BY b.date_borrowed DESC
    `, [id]);
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching borrower history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/* get all borrowers for borrower table */
export async function getAllBorrowersHandler(req, res) {
  try {
    const result = await query(
      `SELECT id, name, email, phone_number FROM borrowers ORDER BY name ASC`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching all borrowers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

/* switch statement to handle all cases */
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
      case 'overdue':
          return overdueHandler(req, res);
      case 'borrowerHistory':
          return getBorrowerHistoryHandler(req, res);
      case 'searchBorrowers':
          return searchBorrowersHandler(req, res);
      case 'getAllBorrowers':
          return getAllBorrowersHandler(req, res);
      case 'groupReturnsByBorrower':
            return groupReturnsByBorrowerHandler(req, res);
      default:
          return res.status(400).json({ error: 'Invalid action' });
  }
}
