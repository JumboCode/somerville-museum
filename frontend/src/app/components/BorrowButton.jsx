'use client'

import Popup from 'reactjs-popup';

import React, { useState } from "react";
import SelectItemButton from "./SelectItem";

// const { Client } = require('pg');
// const client = new Client({ connectionString: 'http://127.0.0.1:5432/borrowbutton' });

// async function borrowItems(itemIds) {
//    await client.connect();

//    const APPROVER_NAME = "temp approver";
//    const APPROVER_EMAIL = "approver@example.com"; 

    
//      try {
//         const unavailableItems = [];
//         const dateBorrowed = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
    
//         // Start a transaction to ensure atomicity
//         await client.query('BEGIN');
    
//         // Check and update each item
//         for (const itemId of itemIds) {
//         const { rows } = await client.query(
//          `SELECT id, status FROM items WHERE id = $1 FOR UPDATE`, 
//           [itemId]
//          );
//         const item = rows[0];
    
//          // Check if item is available
//           if (item.status !== 'available') {
//          unavailableItems.push(itemId);
//           continue;
//          }
    
//         // Update item details to mark as borrowed
//         await client.query(
//         `UPDATE items 
//         SET status = 'borrowed', 
//         date_borrowed = $1, 
//             approver_name = $2, 
//             approver_email = $3 
//             WHERE id = $4`,
//           [dateBorrowed, APPROVER_NAME, APPROVER_EMAIL, itemId]
//         );
//         }
    
//         // Commit the transaction
//         await client.query('COMMIT');
    
//          if (unavailableItems.length > 0) {
//           return {
//           success: false,
//           message: `The following items are not available for borrowing: ${unavailableItems.join(', ')}`
//           };
//       }
    
//        return { success: true, message: "Items borrowed successfully." };
//       } catch (error) {
//         // Rollback the transaction if there’s an error
//         await client.query('ROLLBACK');
//         console.error("Error borrowing items:", error);
//         return { success: false, message: "An error occurred while borrowing items." };
//       } finally {
//          await client.end();
//       }
//     }

const BorrowButton = () => {
    const [selectedItems, setSelectedItems] = useState(''); 
    const [isOpen, setIsOpen] = useState(false); 
    const [borrowerName, setBorrowerName] = useState(' ');
    const [borrowerEmail, setBorrowerEmail] = useState(' '); 
    const [returnWeeks, setReturnWeeks] = useState(1);
    const isEmailValid = borrowerEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

   
    const calculateReturnDate = (weeks) => {
          const today = new Date();
          today.setDate(today.getDate() + weeks * 7);
          return today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        };

    const returnDate = calculateReturnDate(returnWeeks);

    // const itemIds = [1, 2, 3]; // Example selected items

    //     borrowItems(itemIds)
    //     .then((result) => {
    //         console.log(result.message);
    //     })
    //     .catch((error) => {
    //         console.error("Error:", error);
    //     });
    
  
    const handleSubmit = async () => {
        if (!isEmailValid) {
            alert('Please enter valid email');
            return; 
        }

        const borrowedInfo = {
            borrowerName,
            borrowerEmail,
            returnDate,
            selectedItems,
        };
        console.log('reached!'); 
        console.log(borrowedInfo); //SEND DATA TO API?

    
            const body = JSON.stringify({
              borrowedInfo: borrowedInfo
          });

          console.log('Body:', body); // Should log the body with hardcoded values
        
           await fetch('http://127.0.0.1:5432/borrowbutton', {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: body
          });

          

        closePopup(); 
    }

    // Function to open and close the popup
    const openPopup = () => setIsOpen(true);
    const closePopup = () => setIsOpen(false);

    // const handleSelectItem 

    return (
        <div> 
           <button onClick={openPopup}> Borrow </button>
            <Popup 
                open={isOpen}
                onClose={closePopup}
                modal
                nested> 

                <form> 
                    <label> 
                       <SelectItemButton onSelect={setSelectedItems} />
                    </label>
                </form>
                <hr/>

                <ls>
                    <label> Selected Items:{selectedItems} </label>
                    {/* display selected Items */}
                </ls>
                
                <form> 
                    <hr/>
                    <label>
                        Borrower Name: 
                        <input
                            name="borrowerName"
                            value={borrowerName}
                            onChange={(e) => setBorrowerName(e.target.value)}
                        />
                        
                    </label>
                    <hr/>
                    <label>
                        Borrower Email: 
                        <input
                            type="email"
                            placeholder="Borrower's Email"
                            value={borrowerEmail}
                            onChange={(e) => setBorrowerEmail(e.target.value)}
                            style={{ borderColor: isEmailValid || !borrowerEmail ? 'initial' : 'red' }}
                        />
                    </label>
                    <hr/>
                    <label>
                        Return Date: 
                        <select value={returnWeeks} onChange={(e) => setReturnWeeks(Number(e.target.value))}>
                        <option value={1}>1 week</option>
                        <option value={2}>2 weeks</option>
                        <option value={3}>3 weeks</option>
                        </select>

                    </label>

                    
                        <button onClick={handleSubmit}>Confirm Borrow</button> 
                    

                </form>

                <div>
                    <button onClick={closePopup}>Exit</button>
                </div>

            </Popup>
        </div>
    )
}



export default BorrowButton; 
