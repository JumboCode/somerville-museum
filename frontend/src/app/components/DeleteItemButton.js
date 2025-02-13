
/**************************************************************
 *
 *                     DeleteItemButton.js
 *
 *        Authors: Dan Glorioso & Hannah Jiang & Zack White
 *           Date: 02/16/2025
 *
 *     Summary: The Delete button in the top bar of the inventory page
 *              that allows the user to delete the selected item(s). This file
 *              is responsible for calling and setting the state of the 
 *              DeletePopup component and executing the delete query.
 * 
 **************************************************************/

"use client";

import { useState } from "react";
import StylishButton from "./StylishButton";
import DeletePopup from "./DeletePopup";

 export default function DeleteItemButton( { selectedItems = [] }) {
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [isItemSelected, setItemSelected] = useState(false);
    const handleClick = () => {
        checkIfItemsSelected();
        setPopupVisible(true)
    };

    const handleCancel = () => {
        setPopupVisible(false);  // Hide the popup
    };

    const checkIfItemsSelected = () => {
        // Check if the selectedItem input is empty
        if (selectedItems.length === 0) {
            setItemSelected(false);
        } else {
            setItemSelected(true);
        }
    };

    const handleConfirm = async () => {
        setPopupVisible(false);   // Close the popup

        // Delete the item using the query
        try {
            const response = await fetch(`../../api/db`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: 'DELETE FROM dummy_data WHERE id = ANY($1)',
                    params: [selectedItems.map(item => item.id)],
                }),
            });

            if (!response.ok) {
                throw new Error(`Fetch error: ${response.status} - ${response.statusText}`);
            }
            
            // Reload the page
            location.reload();
        } catch (error) {
            alert("An error occurred. Please try again.");
            return;
        }
    };

        return (
            <div>
                {/* Delete Button */}
                <StylishButton
                    label = "Delete"
                    styleType={isItemSelected ? "style1" : "style6"}
                    onClick={handleClick}
                >
                </StylishButton>

                {/* Popup Component */}
                {isPopupVisible && isItemSelected && (
                <DeletePopup 
                    onConfirm={handleConfirm} 
                    onCancel={handleCancel} 
                    selectedItems={selectedItems}
                    />
                )}
            </div>
        );
    }