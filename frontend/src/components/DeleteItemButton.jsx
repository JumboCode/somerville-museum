"use client";  // This directive marks the component as a Client Component

import { useState } from "react";

export default function DeleteItemButton() {
    const handleClick = () => {

        // Replace the alert with your actual functionality.
        let name = prompt("Please enter item name", "");

        // Call the 'select' endpoint to get the item ID
        fetch(`http://localhost:3000/select?name=${name}`, {
            method: 'GET',
            })

            .then(response => response.json()) // Convert the response to JSON

            // Send the ID to the delete route
            .then(data => {
                if (data.length > 0) {
                    const itemIds = data.map(item => item.id).join(", ");
                    for (let i = 0; i < itemIds.length; i++) {
                        fetch(`http://localhost:3000/delete?id=${itemIds[i]}`, {
                            method: 'GET',
                        })
                    }
                } else {
                    alert("Item(s) not found.");
                }
            })

            .catch(error => {
                console.error('Error fetching item:', error);
                alert('Error fetching item. Please try again later.');
            });
    };

    return (
        <button
            className="text-center border p-2 rounded bg-gray-100 hover:bg-gray-200"
            onClick={handleClick}
        >
            Delete Item
        </button>
    );
}
