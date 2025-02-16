'use client'

import React, { useState, useEffect } from "react";
import "./ReturnButton.css"
import ReturnPopup from "./ReturnPopup.jsx"
import StylishButton from './StylishButton.jsx'; //import css file

const ReturnButton = ( {selectedItems = [], onSuccess } ) => {  //takes in selected items as a parameter
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [borrowedSelectedItems, setBorrowedSelectedItems] = useState(selectedItems); 

    const handleSubmit = async (e) => {
        if(selectedItems == 0) {
            alert('No Items selected.'); 
        } else {
            const isValid = await handleValidity();
            if (isValid) {
                setIsPopupVisible(true);  // Open the popup only if validity is true
            } else {
                alert('Some items are invalid. Please try again.');
            }
        }
        console.log(selectedItems);
    }

    async function handleValidity() {

        try {
          const response = await fetch('../../api/returnValidity', {
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
    
          //reset available items after check
          setBorrowedSelectedItems(result.availableItems); 

          //return false if nothing in array
          if (result.availableItems.length == 0) {
            return false;
          }
    
          return true; // Return true if the validity check passes
        } catch (error) {
          console.error('Error during validity check:', error);
          return false; // Return false if there's an error
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
            )

            }
        </div>
    )
}

export default ReturnButton;