"use client";  // This directive marks the component as a Client Component

import React, { useState } from 'react';
import ExpandedEntry from './ExpandedEntry.jsx';

 export default function SelectItemButton() {
    const [showPopup, setShowPopup] = useState(false);
    const [itemData, setItemData] = useState(null);
     const handleClick = () => {
         let id = prompt("Please enter item id", "");

         if (id == null || id == "") {
             alert("User cancelled the prompt.");
         } else {
             // Making a GET request to the 'select' endpoint 
             fetch(`http://localhost:5432/item/${id}`, { 
                method: 'GET',
            })
            // Handling the response by converting it to JSON 
            .then(response => response.json()) 
            
            // Setting the itemData state to the response
            .then(data => {
                setItemData(data); // Set the item data
                setShowPopup(true); // Show the popup
            })

            .catch(error => {
                console.error('Error fetching item:', error);
                alert('Error fetching item. Please try again later.');
            });
        }
    };

    return (
        <div>
            <button onClick={handleClick}>Select Item</button>
            {showPopup && <ExpandedEntry itemData={itemData} onClose={() => setShowPopup(false)} />}
        </div>
    );
}