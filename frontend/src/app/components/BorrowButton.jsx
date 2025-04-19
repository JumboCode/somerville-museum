'use client'

// import Popup from 'reactjs-popup';
import React, { useState } from "react";
import StylishButton from './StylishButton.jsx';
import BorrowPopup from './BorrowPopup.jsx';

const BorrowButton = ({ selectedItems = [], onSuccess, isValid }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(""); 
  const [availableSelectedItems, setAvailableSelectedItems] = useState(selectedItems);

  // This function checks the validity of the selected items
  async function handleValidity() {

    try {
      const response = await fetch('../../api/borrowManagement?action=borrowValidity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedItems: selectedItems.map(item => item.id),
        }),
      });

      if (!response.ok) {
        throw new Error(`Fetch error: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json(); 
      if (result.message) {
          setAlertMessage(result.message);  
          setIsAlertOpen(true); 
      } else {
        setIsOpen(true)
      }

      //reset available items after check
      setAvailableSelectedItems(result.availableItems);   

      return true; // Return true if the validity check passes
    } catch (error) {
      console.error('Error during validity check:', error);
      return false; // Return false if there's an error
    }
  }

  // This function is triggered when the button is clicked
  const handleButtonClick = async () => {
    if(!isValid || selectedItems == 0) {
      return; 
    } 
       // Check the validity 
      handleValidity();

  }

  return (
    <div>
      <StylishButton
        label="Borrow"
        styleType={isValid ? "style1" : "style6"}
        onClick={handleButtonClick}
        disabled={!isValid}
      />
      {isAlertOpen && (
        <div className="alert-container">
          <div className="alert-box">
            <p> The following item(s) are not available:</p>
            <h2>{alertMessage}</h2>
            <div className="alert-row"> 
              <StylishButton styleType="style1" onClick={() => setIsAlertOpen(false)}>Cancel</StylishButton>
              <StylishButton styleType="style3" onClick={() => {
                setIsAlertOpen(false); 
                setIsOpen(true);
              }}>Continue</StylishButton> 
            </div> 
          
          </div>
        </div>
      )}


    {isOpen && (
        <div className="custom-popup-large">
          <BorrowPopup
            selectedItems={availableSelectedItems}
            onClose={() => setIsOpen(false)}
            onSuccess={() => {
              if (onSuccess) onSuccess();
              setIsOpen(false); // Close the popup
            }}
          />
        </div>

    )}

    </div>
  );
};

export default BorrowButton;
