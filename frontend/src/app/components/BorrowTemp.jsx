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
    const isEmailValid = borrowerEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

    console.log('Selected Items:', selectedItems);

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


    const handleSubmit = async (e) => {
        // Check if any required fields are empty
        if (!borrowerFirstName.trim() || !borrowerLastName.trim() || !borrowerEmail.trim() || !phoneNumber.trim() || !approver.trim() || !returnWeeks) {
            alert('Please fill out all required fields.');
            return; // Prevent submission
        }

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
                    borrowerFirstName,
                    borrowerLastName,
                    borrowerEmail,
                    dueDate,
                    approver,
                    note,
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
            resetFields();  

        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };

    //reset feild when user exits or submits
    const resetFields = () => {
        setBorrowerName('');
        setBorrowerEmail('');
        setReturnWeeks(1);
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
