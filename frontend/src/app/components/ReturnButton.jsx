'use client'

import React, { useState, useEffect } from "react";
import "./ReturnButton.css"
import ReturnPopup from "./ReturnPopup.jsx"
import StylishButton from './StylishButton.jsx';

const ReturnButton = ( {selectedItems = [], onSuccess } ) => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [borrowedSelectedItems, setBorrowedSelectedItems] = useState(selectedItems); 

    const handleSubmit = async (e) => {
        if(selectedItems == 0) {
            alert('No Items selected.'); 
        } else {
            const isValid = await handleValidity();
            if (isValid) {
                // Open the popup only if validity is true
                setIsPopupVisible(true);  
            } else {
                alert('Some items are invalid. Please try again.');
            }
        }
    }

    async function handleValidity() {

        try {
          const response = await fetch('../../api/borrowManagement?action=returnValidity', {
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
    
          // Reset available items after check
          setBorrowedSelectedItems(result.availableItems); 

          // Return false if nothing in array
          if (result.availableItems.length == 0) {
            return false;
          }
          // Return true if the validity check passes
          return true; 
        } catch (error) {
          console.error('Error during validity check:', error);
          return false;
        }
      }

    const handleClosePopup = () => {
        setIsPopupVisible(false);
    }

    return (
        <div>
            <StylishButton label="Return" styleType="style1" 
                           onClick={handleSubmit}/>
            { isPopupVisible && (
                <ReturnPopup onClose={handleClosePopup}
                             units = {borrowedSelectedItems}/>
            )}
        </div>
    );
}

export default ReturnButton;
