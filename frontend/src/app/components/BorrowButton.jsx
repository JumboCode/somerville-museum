'use client'

import Popup from 'reactjs-popup';
import React, { useState, useEffect } from "react";
import StylishButton from './StylishButton.jsx'; //import css file

//WE DID NOT IMPLEMENT AUTOMATICALLY UPDATING IF AN ITEM IS OVERDUE
//THE APPROVER INFORMATION IS CURRENTLY STORED AS A GLOBAL VARIABLE
//THE DATE() REACT FUNCTION LOGS ONE DAY AHEAD

//This is the entire borrow button component, it includes the popup, text feilds
//and handling submission and fetching items 
const BorrowButton = ( {selectedItems = [], onSuccess } ) => {
    // const [id, setId] = useState('');
    // const [selectedItems, setSelectedItems] = useState([]); 
    // const [selectedItemIds, setSelectedItemIds] = useState([]); 
    const [isOpen, setIsOpen] = useState(false); 
    const [borrowerName, setBorrowerName] = useState(' ');
    const [borrowerEmail, setBorrowerEmail] = useState(' '); 
    const [dateBorrowed, setDateBorrowed] = useState(' ');
    const [returnWeeks, setReturnWeeks] = useState(1);
    const isEmailValid = borrowerEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    // const itemsArray = Array.isArray(selectedItems) ? selectedItems : Object.values(selectedItems);

    //global vars for approver, temporary
    const APPROVER_NAME = 'Holden Kittleberger';
    const APPROVER_EMAIL = 'XXXXXXXX@slitherio.com'; 

    //calculates the return date based on users selection
    const calculateDueDate = (weeks) => {
          const today = new Date();
          today.setDate(today.getDate() + weeks * 7);
          return today.toLocaleDateString().split('T')[0]; // Format as YYYY-MM-DD
        };

    const dueDate = calculateDueDate(returnWeeks);
    
    //calculates the current day NOTEEEEEE this for some reason logs one day after
    const calculateBorrowDay = () => {
        const today = new Date();
        return today.toLocaleDateString().split('T')[0];
    }
    
    useEffect(() => {
        setDateBorrowed(calculateBorrowDay());
    }, []);

    // //fetches the item by ID, sets the items and their IDS in variables
    // const fetchItemById = async () => {
    //     if (!id) return;
    //     try {
    //         const response = await fetch(`../../api/selectId`, { 
    //             method: 'POST',
    //             headers: {
    //             'Content-Type': 'application/json' 
    //             },
    //             body: JSON.stringify({ id }) 
    //           })
    
    //           if (!response.ok) {
    //             // Handle specific response statuses
    //             if (response.status === 404) {
    //                 console.error("Item not found");
    //                 alert("Item not found. Please check the ID and try again.");
    //                 return; // Exit if item not found
    //             }
    //             throw new Error(`Fetch error: ${response.status}`);
    //         }
    
    //         const data = await response.json();

    //         //if the data was retrieved add it to vars 
    //         if (data) {
    //             setSelectedItems((prevItems) => [...prevItems, data]); 
    //             setSelectedItemIds((prevIds) => [...prevIds, data.id]);
    //             setId(''); 
    //         } 
    //     }
    //     catch (error) {
    //         console.error("Error fetching item:", error);
    //     }
    // };

    //submits the information, updates all data columns with appropriate information
    const handleSubmit = async (e) => {
        if (!isEmailValid) {
            alert('Please enter a valid email');
            return; 
        }

        try {
            const response = await fetch('../../api/borrow', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    dateBorrowed,
                    borrowerName,
                    borrowerEmail,
                    dueDate,
                    APPROVER_NAME,
                    APPROVER_EMAIL, 
                    selectedItems: selectedItems.map(item => item.id)
                })
            });
            
            if (!response.ok) {
                throw new Error(`Fetch error: ${response.status} - ${response.statusText}`);
            }

            const result = await response.json(); 
            if (result.message) {
                alert(result.message);  
            }

            if (onSuccess) {
                onSuccess(); 
            }

            //close and reset feilds when user exits
            closePopup();
            resetFields();  

        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };

    //reset feild when user exits or submits
    const resetFields = () => {
        // setId('');
        // setSelectedItems([]);
        // setSelectedItemIds([]);
        setBorrowerName('');
        setBorrowerEmail('');
        setReturnWeeks(1);
    };


    // Function to open and close the popup
    const openPopup = () => setIsOpen(true);
    const closePopup = () => {
        setIsOpen(false)
        resetFields()};

    return (
        <div> 
           
           <StylishButton label="Borrow" styleType="style1" onClick={openPopup} />

           <Popup open={isOpen} modal nested> 
               {/* Attach onSubmit directly to prevent form submission */}
               <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}> 


                   <div>
                       <h4>Selected Items:</h4>
                       {selectedItems.length > 0 ? (
                           <ul>
                               {selectedItems.map((item, index) => (
                                   <li key={index}>{item.id} - {item.name || "Item Name"}</li> 
                               ))}
                           </ul>
                       ) : (
                           <p>No items selected.</p>
                       )}

                   </div>
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
                   <button type="submit">Confirm Borrow</button> 
                   <button 
                   type="button" 
                   onClick={closePopup}> 
                    Exit</button>
               </form>
           </Popup>
        </div>
    )
}

//the code for selecting and item by entering its ID, would go right before
//selected items
// <label> 
//     {/* <SelectItemButton onSelect={setSelectedItems} /> */}
//     Enter Item Id: 
//     <input
//         type="text"
//         placeholder="Enter Item ID"
//         value={id}
//         onChange={(e) => setId(e.target.value)}
//     />
//     <button type="button" onClick={fetchItemById}>Add Item</button>
// </label> 


export default BorrowButton; 
