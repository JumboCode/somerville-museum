"use client";  // This directive marks the component as a Client Component

 import { useState } from "react";
import StylishButton from "./StylishButton";

 export default function DeleteItemButton() {
     const handleClick = () => {

         // Replace the alert with your actual functionality.
         let name = prompt("Please enter item name", "");

         if (name == null || name == "") {
             alert("User cancelled the prompt.");
         } else {
                 // Call the 'select' endpoint to get the item ID
                 fetch(`../../api/selectByName`, { 
                    method: 'PUT',
                    headers: {
                    'Content-Type': 'application/json' // Specify the content type
                    },
                    body: JSON.stringify({ name }) // Send the name as a JSON object
                  })
                     .then(response => response.json()) // Convert the response to JSON

                     // Send the ID to the delete route
                     .then(data => {
                         if (data.length > 0) {
                             // Map the data to get the item IDs
                             const itemIds = data.map(item => item.id);

                             //Comfirm with the user if they really want to delete the item
                             if (confirm("Do you really want to delete the selected item(s)? \nSelected Item(s): " + itemIds)) {
                                 // For each item ID, make a GET request to the 'delete' endpoint
                                 itemIds.forEach(id => {
                                    fetch(`../../api/db`, { 
                                        method: 'PUT', // Use the PUT method
                                        headers: {
                                          'Content-Type': 'application/json' // Specify the content type
                                        },
                                        body: JSON.stringify({
                                          text: 'DELETE FROM dummy_data WHERE id = $1', // SQL query for deletion
                                          params: [id] // Parameters for the query
                                        })
                                      });
                                 });
                                } else {
                                    alert('User cancelled the deletion.');
                                }
                            } else {
                                alert("Item(s) not found.");
                            }
                        })
   
                        .catch(error => {
                            console.error('Error fetching item:', error);
                            alert('Error fetching item. Please try again later.');
                        });
            }
        };
   
        return (
            <StylishButton
                className="text-center border p-2 rounded bg-gray-100 hover:bg-gray-200"
                onClick={handleClick}
                label = "Delete"
            >

            </StylishButton>
        );
    }