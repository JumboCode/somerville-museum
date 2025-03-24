// BorrowPopup.jsx
//
// Edited by Peter Morganelli, 2/16/25
//
// Purpose: 
//     This file handles the popup functionality when the user clicks the
//     "borrow" button inside of the inventory component. It collects 
//     information about the user and sends the form to the backend, 
//     while also showing the selected items the user wishes to borrow 
//     with styling in accordance to the most updated Figma.

'use client'

import React, { useState, useEffect } from 'react';
// import Popup from 'reactjs-popup';
import BorrowUnit from './BorrowUnit';
import './BorrowPopup.css';
import { useGlobalContext } from './contexts/ToggleContext';

const BorrowPopup = ({ selectedItems = [], onClose, onSuccess }) => {
  const { isToggleEnabled } = useGlobalContext(); // TOGGLE FUNCTIONALITY

  const [borrowerFirstName, setBorrowerFirstName] = useState('');
  const [borrowItems, setBorrowItems] = useState(selectedItems);
  const [borrowerLastName, setBorrowerLastName] = useState('');
  const [borrowerEmail, setBorrowerEmail] = useState('');
  const [dateBorrowed, setDateBorrowed] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [returnWeeks, setReturnWeeks] = useState(''); // no selection initially
  const [returnDate, setReturnDate] = useState(""); // New state for return date

  const [dueDate, setDueDate] = useState(''); // Initially emptyw
  const [approver, setApprover] = useState('');
  const [note, setNote] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(borrowItems.length / itemsPerPage);

  const formatDate = (date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2,'0'); 
    const year = date.getFullYear().toString().slice(-2);
    return `${month}/${day}/${year}`; 
  }

  // Update dateBorrowed when component mounts 
  useEffect(() => {
    const today = new Date(); 
    setDateBorrowed(formatDate(today)); 
  }, []); 

  // Update dueDate when returnWeeks changes 
  useEffect(() => {
    if (isToggleEnabled) {
      // Set dueDate to returnDate when toggle is enabled
      setDueDate(returnDate);
    } else if (returnWeeks && !isToggleEnabled) {
      // Calculate dueDate based on returnWeeks when toggle is disabled
      const today = new Date(); 
      today.setDate(today.getDate() + Number(returnWeeks * 7));
      setDueDate(formatDate(today)); 
    } else {
      // Reset dueDate if no returnWeeks and toggle is disabled
      setDueDate(''); 
    }
  }, [returnWeeks, isToggleEnabled, returnDate]);

  // set some regex variables for expected phone + email formats
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
  const dateRegex = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/\d{2,4}$/;

  const isEmailValid = emailRegex.test(borrowerEmail);
  const isPhoneValid = phoneRegex.test(phoneNumber);
  const isDateValid = dateRegex.test(returnDate);

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

    if (borrowItems.length === 0) {
      alert("No items selected.");
      return;
    }

    // both return date cases
    if (isToggleEnabled && !isDateValid) {
      alert(`Please enter a valid date in the format MM/DD/YYYY .${returnDate}.`);
      return;
    }

    if (!isToggleEnabled && !returnWeeks) {
      alert("Please select a return period.");
      return;
    }

    try {
      const response = await fetch('/api/borrowManagement?action=borrow', {
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
        const errorText = await response.text();
        throw new Error(`Fetch failed: ${response.status} ${errorText}`);
      }


      //EMAIL FOR BORROWED ITEMS BELOW

      const itemNames = borrowItems.map(item => item.name);

      // Debugging: Log the request payload
      console.log("Sending email request:", {
          recipientEmail: borrowerEmail,
          recipientName: `${borrowerFirstName} ${borrowerLastName}`,
          items: itemNames,
      });

      // Make the API call
      if (!isToggleEnabled) {
        const emailResponse = await fetch('/api/email?emailType=sendBorrowedEmail', { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                recipientEmail: borrowerEmail,
                recipientName: `${borrowerFirstName} ${borrowerLastName}`,
                items: itemNames,
            }),
        });

        // Read response as text (to catch non-JSON errors)
        const responseText = await emailResponse.text();
        console.log("Email API Response:", responseText);

        if (!emailResponse.ok) {
            throw new Error(`Email sending failed: ${emailResponse.status} ${responseText}`);
        }
      }


      //EMAIL FOR BORROWED ITEMS ABOVE


      const result = await response.json();
      setIsSuccessPopupVisible(true);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const resetFields = () => {
    setBorrowerFirstName('');
    setBorrowItems([]);
    setBorrowerLastName('');
    setBorrowerEmail('');
    setPhoneNumber('');
    setReturnWeeks('');
    setApprover('');
    setNote('');
    setCurrentPage(1);
  };

  const handleDelete = (item) => {
    setBorrowItems(prevItems => prevItems.filter(i => i.id !== item.id));
  };

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return borrowItems.slice(startIndex, startIndex + itemsPerPage);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container">
      <div className="borrowItemsHeader">
        <div className="borrow-header">
            <h1>Borrow Item(s)</h1>
        </div>
        <div className="borrowItemsContent">
            {borrowItems.length > 0 ? (
            <>
                <div className="borrowed-items-container">
                {getCurrentPageItems().map((item) => (
                    <BorrowUnit
                    key={item.id}
                    item={item}
                    onDelete={handleDelete}
                    />
                ))}
                </div>
                <div className="pagination-container">
                <div className="pagination">
                    <button
                    type="button"
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
                </div>
            </>
            ) : (
            <p>No items selected.</p>
            )}
        </div>
        </div>

      <div className="dividerNew"></div>

      <form onSubmit={handleSubmit} className="info-form">
        <div className="info-header">Information</div>
        <div className="form-row">
          <div className="form-group">
            <label>Borrower First Name*</label>
            <input
              required
              value={borrowerFirstName}
              onChange={(e) => setBorrowerFirstName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Borrower Last Name*</label>
            <input
              required
              value={borrowerLastName}
              onChange={(e) => setBorrowerLastName(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row full-width">
          <div className="form-group full-width">
            <label>Phone Number*</label>
            <input
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row full-width">
          <div className="form-group full-width">
            <label>Email*</label>
            <input
              type="text"
              required
              value={borrowerEmail}
              onChange={(e) => setBorrowerEmail(e.target.value)}
              style={{
                borderColor: isEmailValid || !borrowerEmail ? "#9b525f" : "red",
              }}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Return Period*</label>
            {isToggleEnabled ? (
            <input
                type="text"
                placeholder="MM/DD/YYYY"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                required
            />
            ) : (
            <div className="return-date-box">
              {returnWeeks ? (
                <div className="selected-return">
                  {returnWeeks} {returnWeeks === "1" ? "week" : "weeks"}
                  <button
                    type="button"
                    className="remove-return"
                    onClick={() => setReturnWeeks('')}
                  >
                    x
                  </button>
                </div>
              ) : (
                <select
                  required
                  value={returnWeeks}
                  onChange={(e) => setReturnWeeks(e.target.value)}
                  className="form-group-dropdown"
                >
                  <option value="">Select return period</option>
                  <option value="1">1 week</option>
                  <option value="2">2 weeks</option>
                  <option value="3">3 weeks</option>
                  <option value="4">4 weeks</option>
                  <option value="5">5 weeks</option>
                  <option value="6">6 weeks</option>
                </select>
              )}
            
            </div>
            )}
              {returnWeeks && (
                <div className="due-date-text">Due: {dueDate}</div>
              )}
          </div>
          <div className="form-group">
            <label>Approver*</label>
            <input
              type="text"
              readOnly
              value={approver || "Mary Jane"}
              className="non-editable"
            />
          </div>
        </div>
        <div className="form-row full-width">
          <div className="form-group full-width">
            <label>Notes</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
        <div className="form-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit">Borrow</button>
        </div>
      </form>
      {isSuccessPopupVisible && (
        <div className='success-popup' open={true} onClose={() => setIsSuccessPopupVisible(false)}>
          <div>
            <h2>Borrow Success</h2>
            <p>
              The following items have been successfully borrowed:{" "}
              {borrowItems.map(item => item.id).join(", ")}
            </p>
            <p>Thank you!</p>
            <button onClick={onClose}>Return to Inventory</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowPopup;
