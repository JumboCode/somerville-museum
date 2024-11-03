'use client'

import Popup from 'reactjs-popup';

import React, { useState } from "react";
import SelectItemButton from "./SelectItem";


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
    
    const handleSubmit = () => {
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

