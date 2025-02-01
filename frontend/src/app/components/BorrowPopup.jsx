'use client'

import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import BorrowUnit from './BorrowUnit';
import './BorrowPopup.css'

const BorrowPopup = ({ selectedItems = [], onClose, onSuccess }) => {
    const [borrowerFirstName, setBorrowerFirstName] = useState(''); 
    const [borrowItems, setBorrowItems] = useState(selectedItems); 
    const [borrowerLastName, setBorrowerLastName] = useState(''); 
    const [borrowerEmail, setBorrowerEmail] = useState(''); 
    const [dateBorrowed, setDateBorrowed] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(''); 
    const [returnWeeks, setReturnWeeks] = useState(1);
    const [approver, setApprover] = useState(''); 
    const [note, setNote] = useState(''); 
    const [currentPage, setCurrentPage] = useState(1); 
    const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);

    const itemsPerPage = 5;
    const totalPages = Math.ceil(borrowItems.length / itemsPerPage); 


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


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Format: XXX@domain.YYY
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/; // Format: XXX-XXX-XXXX

    const isEmailValid = emailRegex.test(borrowerEmail);
    const isPhoneValid = phoneRegex.test(phoneNumber);
   
    //submits the information, updates all data columns with appropriate information
    const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (!isEmailValid) {
        alert("Please enter a valid email in the format XXX@domain.YYY");
        return;
    }

    if (!isPhoneValid) {
        alert("Please enter a valid phone number in the format XXX-XXX-XXXX");
        return;
    }

        try {
            if (borrowItems == 0) {
                alert('No items selected.'); 
            } else {
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
                        selectedItems: borrowItems.map(item => item.id),
                    }),
                });
            
                if (!response.ok) {
                    const errorText = await response.text(); // Fetch error text
                    throw new Error(`Fetch failed: ${response.status} ${errorText}`);
                }
            
                const result = await response.json();
    
                setIsSuccessPopupVisible(true);
                // resetFields(); 
                  // Trigger onSuccess after the action
                if (onSuccess) {
                    onSuccess();
                }   
            }


        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    const resetFields = () => {
        setBorrowerFirstName('');
        setBorrowItems([]); 
        setBorrowerLastName('');
        setBorrowerEmail('');
        setPhoneNumber('');
        setReturnWeeks(1);
        setApprover('');
        setNote('');
        setCurrentPage(1); 
    };

    const handleDelete = (item) => {
        setBorrowItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
    };
    
    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return borrowItems.slice(startIndex, startIndex + itemsPerPage);
    };
    //page changes for left hand side
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <h4>Borrow Item(s)</h4>
                    {borrowItems.length > 0 ? (
                        <>
                            <ul>
                                {getCurrentPageItems().map((item) => (
                                    <BorrowUnit
                                        key={item.id}
                                        item={item}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </ul>
                            <div className="pagination">
                                <button
                                    type="pagintion button"
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                >
                                    {"<"}
                                </button>
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index + 1}
                                        type="button"
                                        className={currentPage === index + 1 ? "active" : ""}
                                        onClick={() => handlePageChange(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                >
                                    {">"}
                                </button>
                            </div>
                        </>
                    ) : (
                        <p>No items selected.</p>
                    )}
                </div>

                {/* Borrower Information */}
                <h4>Information</h4>
                <label>
                    Borrower First Name*
                    <input className='input:first-of-type'
                        required
                        value={borrowerFirstName}
                        onChange={(e) => setBorrowerFirstName(e.target.value)}
                    />
                </label>
                <label>
                    Borrower Last Name*
                    <input
                        required
                        value={borrowerLastName}
                        onChange={(e) => setBorrowerLastName(e.target.value)}
                    />
                </label>
                <label>
                    Borrower Email*
                    <input
                        type="text"
                        required
                        value={borrowerEmail}
                        onChange={(e) => setBorrowerEmail(e.target.value)}
                        style={{ borderColor: isEmailValid || !borrowerEmail ? "initial" : "red" }}
                    />
                </label>
                <label>
                    Phone Number*
                    <input
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </label>
                <label>
                    Approver*
                    <input
                        required
                        value={approver}
                        onChange={(e) => setApprover(e.target.value)}
                    />
                </label>
                <label>
                    Note
                    <input value={note} onChange={(e) => setNote(e.target.value)} />
                </label>
                <button type="submit">Borrow</button>
                <button type="button" onClick={onClose}>
                    Cancel
                </button>
            </form>

            {/* Success Popup */}
            {isSuccessPopupVisible && (
                <Popup open={true} onClose={() => setIsSuccessPopupVisible(false)}>
                    <div>
                        <h2>Borrow Success</h2>
                        <p>
                            The following items have been successfully borrowed:{" "}
                            {borrowItems.map((item) => item.id).join(", ")}
                        </p>
                        <p>Thank you!</p>
                        <button onClick={onClose}>Return to Inventory</button>
                    </div>
                </Popup>
            )}
        </div>
    );
};

export default BorrowPopup;
