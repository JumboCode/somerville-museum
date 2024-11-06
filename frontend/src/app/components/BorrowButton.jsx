'use client'

import Popup from 'reactjs-popup';
import React, { useState, useEffect } from "react";


//TOOOODOOOOOOOOOOOOO::: CAN I ADD A PARAMETER TO ADD ITEM THAT TAKES IN THE STATUS? 
// SO ITEM ENTERER CAN DETERMINE WHETHER OR NOT IT CAN BE BORROWED, AND WE CAN SEE IF ITS UNAVAILABLE
//HOW AND IN WHICH COLUMN DO WE SET THE APPROVER EMAIL AND NAME? 


const BorrowButton = () => {
    const [id, setId] = useState('');
    const [selectedItems, setSelectedItems] = useState([]); 
    const [selectedItemIds, setSelectedItemIds] = useState([]); 
    const [isOpen, setIsOpen] = useState(false); 
    const [borrowerName, setBorrowerName] = useState(' ');
    const [borrowerEmail, setBorrowerEmail] = useState(' '); 
    const [dateBorrowed, setDateBorrowed] = useState(' ');
    const [returnWeeks, setReturnWeeks] = useState(1);
    const isEmailValid = borrowerEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

   
    const calculateReturnDate = (weeks) => {
          const today = new Date();
          today.setDate(today.getDate() + weeks * 7);
          return today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        };

    const returnDate = calculateReturnDate(returnWeeks);
    
    const calculateBorrowDay = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }
    
    useEffect(() => {
        setDateBorrowed(calculateBorrowDay());
    }, []);

    const fetchItemById = async () => {
        if (!id) return;
        try {
            const response = await fetch(`../../api/selectId`, { 
                method: 'POST',
                headers: {
                'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ id }) 
              })
    
              if (!response.ok) {
                // Handle specific response statuses
                if (response.status === 404) {
                    console.error("Item not found");
                    alert("Item not found. Please check the ID and try again.");
                    return; // Exit if item not found
                }
                throw new Error(`Fetch error: ${response.status}`);
            }
    
            const data = await response.json();
            console.log('Fetched data:', data); 
    
            if (data) {
                setSelectedItems((prevItems) => [...prevItems, data]); 
                setSelectedItemIds((prevIds) => [...prevIds, data.id]);
                setId(''); 

            } 
        }
        catch (error) {
            console.error("Error fetching item:", error);
        }
    };
    
    const handleSubmit = async (e) => {
        if (!isEmailValid) {
            alert('Please enter a valid email');
            return; 
        }

        try {
            console.log(selectedItemIds); 
            const response = await fetch('../../api/borrow', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    dateBorrowed,
                    borrowerName,
                    borrowerEmail,
                    returnDate,
                    selectedItems: selectedItemIds
                })
            });
            
            if (!response.ok) {
                throw new Error(`Fetch error: ${response.status} - ${response.statusText}`);
            }

            const result = await response.json(); 

            if (result.message) {
                console.log(result.message);  // For debugging purpose
                alert(result.message);  // Show the message to the user
            }

            closePopup();
            resetFields();  // Ensure this function is spelled correctly

        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };

    const resetFields = () => {
        setId('');
        setSelectedItems([]);
        setSelectedItemIds([]);
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
           <button onClick={openPopup}> Borrow </button>
           <Popup open={isOpen} modal nested> 
               {/* Attach onSubmit directly to prevent form submission */}
               <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}> 
                   <label> 
                       {/* <SelectItemButton onSelect={setSelectedItems} /> */}
                       Enter Item Id: 
                       <input
                         type="text"
                         placeholder="Enter Item ID"
                         value={id}
                         onChange={(e) => setId(e.target.value)}
                        />
                        <button type="button" onClick={fetchItemById}>Add Item</button>
                   </label>

                   <div>
                       <h4>Selected Items:</h4>
                       {selectedItems.length > 0 ? (
                           <ul>
                               {selectedItems.map((item, index) => (
                                   <li key={index}>{item.id} - {item.name || "Item Name"}</li> // Adjust 'name' if necessary
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



export default BorrowButton; 
