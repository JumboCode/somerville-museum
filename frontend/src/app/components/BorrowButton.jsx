'use client'

import Popup from 'reactjs-popup';
import React, { useState, useEffect } from "react";
import StylishButton from './StylishButton.jsx'; //import css file
import BorrowPopup from './BorrowPopup.jsx';

const BorrowButton = ({ selectedItems = [], onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [availableSelectedItems, setAvailableSelectedItems] = useState(selectedItems);
  // console.log(selectedItems);
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
          alert(result.message);  
      }

      console.log("RESULT", result);
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
    if(selectedItems == 0) {
      alert('No Items selected.'); 
    } else {
        // Check the validity before opening the popup
    const isValid = await handleValidity();
      if (isValid) {
        setIsOpen(true);  // Open the popup only if validity is true
      } else {
        alert('Some items are invalid. Please try again.');
      }
    }

  }

  return (
    <div>
      <StylishButton
        label="Borrow"
        styleType="style1"
        onClick={handleButtonClick}
      />

      <Popup
        className='popup-wrapper'
        open={isOpen}
        modal
        onClose={() => setIsOpen(false)} // Close the popup when it's closed
      >
        {(close) => (
          <BorrowPopup
          selectedItems={availableSelectedItems}
          onClose={close}
          onSuccess={() => {
            // Call the parent's onSuccess if provided
            if (onSuccess) {
              onSuccess(); // Reset data in parent component
            }
          }}
        />)}

      </Popup>
    </div>
  );
};

export default BorrowButton;
