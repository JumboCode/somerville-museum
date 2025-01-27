'use client'

import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';

const BorrowTemp = ({ selectedItems = [], onClose }) => {
    const [borrowerFirstName, setBorrowerFirstName] = useState(''); 
    const [borrowerLastName, setBorrowerLastName] = useState(''); 
    const [borrowerEmail, setBorrowerEmail] = useState(''); 
    const [dateBorrowed, setDateBorrowed] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(''); 
    const [returnWeeks, setReturnWeeks] = useState(1);
    const [approver, setApprover] = useState(''); 
    const [note, setNote] = useState(''); 

    // if (!isEmailValid) {
    //     alert('Please enter a valid email');
    //     return;
    // }

 
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
  const isEmailValid = borrowerEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
   
  //submits the information, updates all data columns with appropriate information
  const handleSubmit = async (e) => {
    e.preventDefault(); 

        if (!isEmailValid) {
          alert('Please enter a valid email');
          return; 
        }

        let borrowerName = (borrowerFirstName + ' ' + borrowerLastName); 
        console.log('items being sent into API:', selectedItems);

    try {
        const response = await fetch('/api/borrow', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                dateBorrowed,
                borrowerName: `${borrowerFirstName} ${borrowerLastName}`,
                borrowerEmail,
                phoneNumber,
                dueDate,
                approver,
                note,
                selectedItems: selectedItems.map(item => item.id),
            }),
        });
    
        if (!response.ok) {
            const errorText = await response.text(); // Fetch error text
            throw new Error(`Fetch failed: ${response.status} ${errorText}`);
        }
    
        const result = await response.json();
        alert(result.message || 'Success!');
        resetFields();
    } catch (error) {
        console.error('Error submitting data:', error);
    }
        
  };

    const resetFields = () => {
        setBorrowerFirstName('');
        setBorrowerLastName('');
        setBorrowerEmail('');
        setPhoneNumber('');
        setReturnWeeks(1);
        setApprover('');
        setNote('');
    };
    

    return (
        <div>
            {/* Directly use the passed onClose function to close the popup */}
            <form onSubmit={handleSubmit}> 
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
                    Borrower First Name* 
                    <input
                        name="borrowerFirstName"
                        placeholder="John"
                        required
                        value={borrowerFirstName}
                        onChange={(e) => setBorrowerFirstName(e.target.value)}
                    />
                </label>

                <label>
                    Borrower Last Name* 
                    <input
                        name="borrowerLastName"
                        placeholder="Appleseed" 
                        required
                        value={borrowerLastName}
                        onChange={(e) => setBorrowerLastName(e.target.value)}
                    />
                </label>

                <hr/>

                <label>
                    Phone Number* 
                    <input
                        placeholder="(123) 123-1234" 
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </label>

                <hr/>

                <label>
                    Borrower Email* 
                    <input
                        type="email"
                        placeholder="johnappleseed@gmail.com" 
                        required
                        value={borrowerEmail}
                        onChange={(e) => setBorrowerEmail(e.target.value)}
                        style={{ borderColor: isEmailValid || !borrowerEmail ? 'initial' : 'red' }}
                    />
                </label>

                <label>
                    Return Date* 
                    <select value={returnWeeks} onChange={(e) => setReturnWeeks(Number(e.target.value))}>
                        <option value={1}>1 week</option>
                        <option value={2}>2 weeks</option>
                        <option value={3}>3 weeks</option>
                        <option value={4}>4 weeks</option>
                        <option value={5}>5 weeks</option>
                        <option value={6}>6 weeks</option>
                    </select>
                </label>

                <label>
                    Approver* 
                    <input
                        name="approver"
                        placeholder="Mary Jane" 
                        required
                        value={approver}
                        onChange={(e) => setApprover(e.target.value)}
                    />
                </label>

                <hr/> 

                <label> 
                    Note 
                    <input
                        type="text" 
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </label>

                <button type="submit">Confirm Borrow</button> 
                {/* Use the passed onClose function to close the popup */}
                <button type="button" onClick={onClose}>Exit</button>
            </form>
        </div>
    );
};

export default BorrowTemp;
