import { query } from './db.js';

export async function borrowHandler(req, res) {

  let message; 

  const { dateBorrowed, borrowerName, borrowerEmail, phoneNumber, dueDate, 
          approver, note, selectedItems } = req.body;
   
  if (selectedItems == 0) {
    message = "No items selected."
    res.status(200).json({message}); 
  }
        
  try {

    //check for existing borrower
    const existingBorrowerResult = await query(
      `SELECT * FROM borrowers where email = $1`, [borrowerEmail]
    );

    let borrowerId; 
 
    //if borrower doesn't exist, create new borrower
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
      let dateReturned = null; 
 
      const borrowObject = {
        borrowerId, 
        itemId,
        dateBorrowed,
        dueDate, 
        dateReturned, 
        approver,
        note
      }; 

      //updating borrowers with correct information
      const historyUpdateResult = await query(
        `
        UPDATE borrowers
        SET borrow_history = COALESCE(
          jsonb_set(
            borrow_history::jsonb,  -- Explicit cast to JSONB
            ARRAY[$1::text],        -- Ensure itemId is treated as text
            COALESCE(borrow_history->$1::text, '{}'::jsonb) || $2::jsonb
          ),
          jsonb_build_object($1::text, $2::jsonb)
        )
        WHERE id = $3 RETURNING borrow_history
        `,
        [itemId.toString(), JSON.stringify(borrowObject), borrowerId]
      );
      
      
      let borrowHistory = historyUpdateResult.rows[0].borrow_history; 
    
      //now updating the borrows table with correct information
      const borrowsResult = await query(
        'INSERT INTO borrows (borrower_id, item_id, date_borrowed, return_date, date_returned, approver, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id', 
        [borrowerId, itemId, dateBorrowed, dueDate, dateReturned, approver, note]
      );

      let borrowId = borrowsResult.rows[0].id; 

      const borrowerObject = {
        borrowerName, 
        borrowerEmail,
        phoneNumber,
        borrowHistory
      };

      // await query("UPDATE dummy_data SET status = 'Available' WHERE id = $1", itemId)
      //update each item's current_borrower, borrow_history, and borrower
      await query(
        `UPDATE dummy_data
        SET borrow_history = ARRAY_APPEND(
          COALESCE(borrow_history, '{}'), 
          $1::integer
        ), status = $2, current_borrower = $1
        WHERE id = $3 `,
        [borrowerId, 'Borrowed', itemId]
      
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

    //arrays to keep track of items 
    const invalidItems = [];
    const validItems = []; 

    //update notes when it changes
    for (let i = 0; i < notes_content.length; i++) {

      //checks status of each item 
      const statusResult = await query(
        'SELECT current_borrower FROM dummy_data WHERE id = $1', [notes_id[i]] 
      ); 
      const curr_borrower = statusResult.rows[0].current_borrower;
      //update notes in borrows table 
      await query(
        "UPDATE borrows SET notes = $1 FROM dummy_data WHERE borrows.borrower_id = $2 AND borrows.item_id = $3",
        [notes_content[i], curr_borrower, notes_id[i]]
       )
    }

    for (const itemId of selectedItems) {
      //update date_returned in borrows table 
      await query(
        "UPDATE borrows SET date_returned = $1 FROM dummy_data WHERE borrows.borrower_id = dummy_data.current_borrower AND borrows.item_id = $2",
        [Intl.DateTimeFormat("en-US").format(new Date()), itemId]
       )

        // Using array_append with COALESCE to borrower_history, sending all other data
        await query(
        'UPDATE dummy_data SET status = $1, borrow_history = array_append(borrow_history, current_borrower),\
        current_borrower = NULL WHERE id = $2', 
        ['Available', itemId]
      );

      //add item to available items 
      validItems.push(itemId);

    }
    
    let message = 'Returning process completed. ';

    if (validItems.length > 0) {
      message += `Sucessfully returned items ${validItems.join(', ')}. `
    }
    if (invalidItems.length > 0) {
      message += `The following items were unable to be returned: ${invalidItems.join(', ')}. `
    }


    res.status(200).json({message}); // Send the result back to the frontend
  } catch (error) {
    console.error("Database query error:", error);
    console.error("in catch error");
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
        'SELECT id, name, status FROM dummy_data WHERE id = $1',
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
      message += `The following item(s) are not available: ${unavailableItems
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


export async function returnValidityHandler(req, res) {
  const { selectedItems } = req.body;

  try {
    // Arrays to keep track of items
    const availableItems = [];
    const unavailableItems = [];

    for (const itemId of selectedItems) {
      // Query the status of each item
      const statusResult = await query(
        'SELECT id, name, status FROM dummy_data WHERE id = $1',
        [itemId]
      );

      const itemDetails = statusResult.rows[0]; // Get item details

      if (!itemDetails) {
        // Handle case where the item doesn't exist in the database
        unavailableItems.push({ id: itemId, reason: "Item not found" });
        continue;
      }

      // If the item is not available, add to unavailable items
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
      message += `The following item(s) are not able to be returned: ${unavailableItems
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
      'SELECT * FROM borrows WHERE TO_DATE(return_date, \'MM/DD/YYYY\') BETWEEN TO_DATE($1, \'YYYY-MM-DD\') AND TO_DATE($2, \'YYYY-MM-DD\')',
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

export async function getFirstTwoBorrowedItemsHandler(req, res) {
  // THIS IS ALL BROKEN SOMEONE PLEASE FIX IT :3 Thanks!
    // try {
    //   // Query to select the first two items with 'Borrowed' status
    //   const result = await query(
    //     'SELECT id, status, borrower_history, approver_info FROM dummy_data WHERE status = $1 LIMIT 2', 
    //     ['Borrowed']
    //   );

    //   //Query to select all items with 'Borrowed' status
    //     // const result = await query(
    //     //     'SELECT id, status, borrower_history, approver_info FROM dummy_data WHERE status = $1', 
    //     //     ['Borrowed']
    //     // );
  
    //   // Check if any borrowed items exist
    //   if (result.rows.length === 0) {
    //     return {
    //       message: 'No borrowed items found.',
    //       borrowedItems: []
    //     };
    //   }
  
    //   // Transform the results into a more readable format
    //   const borrowedItems = result.rows.map(item => ({
    //     id: item.id,
    //     status: item.status,
    //     borrowerHistory: item.borrower_history ? item.borrower_history[item.borrower_history.length - 1] : null,
    //     approverInfo: item.approver_info
    //   }));
  
    //   return {
    //     message: `Found ${result.rows.length} borrowed item(s)`,
    //     borrowedItems: borrowedItems
    //   };
  
    // } catch (error) {
    //   console.error("Database query error:", error);
    //   throw new Error('Failed to retrieve borrowed items');
    // }
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
        case 'getFirstTwoBorrowedItems':
            return getFirstTwoBorrowedItemsHandler(req, res);
        case 'overdue':
            return overdueHandler(req, res);
    
        default:
            return res.status(400).json({ error: 'Invalid action' });
    }
}