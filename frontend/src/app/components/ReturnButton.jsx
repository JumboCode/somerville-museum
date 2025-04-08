'use client'

import React, { useState, useEffect } from "react";
import "./ReturnButton.css"
import ReturnPopup from "./ReturnPopup.jsx"
import StylishButton from './StylishButton.jsx';

const ReturnButton = ( {selectedItems = [], onSuccess, isValid } ) => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [borrowedSelectedItems, setBorrowedSelectedItems] = useState(selectedItems); 
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState(""); 

    const handleSubmit = async (e) => {
        if(selectedItems == 0) {
            alert('No Items selected.'); 
        } else {
            handleValidity();
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
              setAlertMessage(result.message); 
              setIsAlertOpen(true); 
          } else {
            setIsPopupVisible(true); 

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
            <StylishButton 
              label="Return" 
              styleType={isValid ? "style1" : "style6"}
              onClick={handleSubmit}
              disabled={!isValid}
              />

          {isAlertOpen && (
            <div className="alert-container">
              <div className="alert-box">
                <p> The following item(s) are not able to be returned: </p>
                <h2>{alertMessage}</h2>
                <div className="alert-row"> 
                  <StylishButton styleType="style1" onClick={() => setIsAlertOpen(false)}>Cancel</StylishButton>
                  <StylishButton styleType="style3" onClick={() => {
                    setIsAlertOpen(false); 
                    setIsPopupVisible(true);
                  }}>Continue</StylishButton> 
                </div> 
              
              </div>
            </div>
          )}

            { isPopupVisible && (
                <ReturnPopup onClose={handleClosePopup}
                onSuccess={() => {
                  if (onSuccess) onSuccess();
                  setIsPopupVisible(false); // Close the popup
                }}

                             units = {borrowedSelectedItems}/>
            )}


        </div>

        
    );
}

export default ReturnButton;
