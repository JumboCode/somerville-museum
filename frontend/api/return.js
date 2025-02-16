import { query } from './db.js';

export default async function handler(req, res) {
  const { selectedItems } = req.body;
  const { notes_id } = req.body;
  const { notes_content } = req.body;
  
  console.log(notes_id);
  console.log(notes_content);

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
      console.log(notes_content[i]);
      console.log(notes_id[i]);
      console.log(curr_borrower);
      await query(
        "UPDATE borrows SET notes = $1 FROM dummy_data WHERE borrows.borrower_id = $2 AND borrows.item_id = $3",
        [notes_content[i], curr_borrower, notes_id[i]]
       )
    }

    for (const itemId of selectedItems) {
      //error checks moved to returnValidity

      // //checks status of each item 
      // const statusResult = await query(
      //   'SELECT status FROM dummy_data WHERE id = $1', [itemId] 
      // ); 

      // const itemStatus = statusResult.rows[0].status; 
      
      // //if the item isnt available, add to unavailable items 
      // if(itemStatus !== 'Borrowed' && itemStatus !== 'Overdue') {
      //   invalidItems.push(itemId); 
      //   continue;   //continue to next item
      // }

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


