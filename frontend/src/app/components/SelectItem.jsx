"use client";

import React, { useState } from 'react';
import ExpandedEntry from './ExpandedEntry';

export default function SelectItemButton() {
    const [showPopup, setShowPopup] = useState(false);
    const [itemData, setItemData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleClick = async () => {
        const id = prompt("Please enter item id", "");

        if (!id) {
            alert("User cancelled the prompt.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('../../api/selectId', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setItemData(data);
            setShowPopup(true);
        } catch (error) {
            console.error('Error fetching item:', error);
            setError('Failed to fetch item. Please try again later.');
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative">
            <button 
                onClick={handleClick}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
                {isLoading ? 'Loading...' : 'Select Item'}
            </button>
            
            {error && (
                <div className="text-red-500 mt-2">{error}</div>
            )}
            
            {showPopup && (
                <ExpandedEntry 
                    itemData={itemData} 
                    onClose={() => setShowPopup(false)} 
                />
            )}
        </div>
    );
}
//   const handleClick = () => {
//     let name = prompt("Please enter item name", "");

//     if (name == null || name === "") {
//       alert("User cancelled the prompt.");
//     } else {
//       // Making a GET request to the serverless function endpoint
//       fetch(`../../api/selectByName`, { 
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json' // Specify the content type
//         },
//         body: JSON.stringify({ name }) // Send the name as a JSON object
//       })
//         .then(response => {
//           if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//           }
//           return response.json();
//         })
//         .then(data => {
//           if (data.length > 0) {
//             const itemIds = data.map(item => item.id).join(", ");
//             alert(`Item ID(s): ${itemIds}`);
//           } else {
//             alert("Item not found.");
//           }
//         })
//         .catch(error => {
//           console.error('Error fetching item:', error);
//           alert('Error fetching item. Please try again later.');
//         });
//     }
//   };

//   return (
//     <button
//       className="text-center border p-2 rounded bg-gray-100 hover:bg-gray-200"
//       onClick={handleClick}
//     >
//       Select Item
//     </button>
//   );
// }
