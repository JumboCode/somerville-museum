"use client";  // This directive marks the component as a Client Component

import { useState } from "react";

export default function SelectItemButton() {
    const handleClick = () => {

        // Replace the alert with your actual functionality.
        let name = prompt("Please enter item name", "");


        let text;
        if (name == null || name == "") {
            text = "User cancelled the prompt.";
        } else {
            // Making a GET request to the 'select' endpoint 
            fetch('http://localhost:3000/select?name=${encodeURIComponent(name)}', { 
                method: 'GET',
                }) 
                // Handling the response by converting it to JSON 
                .then(response => response.json()) 
                // Handling the data obtained from the response 
                .then(data => {
                    console.log("Select item!!");
                    // Handle the returned item ID from the response
                    if (result.length > 0) {
                        const itemId = result[0].id;
                        alert(`The ID for the item '${itemName}' is: ${itemId}`);
                    } else {
                        alert(`Item '${itemName}' not found.`);
                    }
                })
                .catch(error => {
                    console.error('Error fetching item:', error);
                    alert('Error fetching item. Please try again later.');
                });
        }
    };

    return (
        <button
            className="text-center border p-2 rounded bg-gray-100 hover:bg-gray-200"
            onClick={handleClick}
        >
            Select Item
        </button>
    );
}
