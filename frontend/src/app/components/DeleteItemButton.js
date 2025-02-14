
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

import { useEffect, useState } from "react";
import StylishButton from "./StylishButton";
import DeletePopup from "./DeletePopup";

 export default function DeleteItemButton( { selectedItems, isChecked }) {
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [isItemSelected, setItemSelected] = useState(false);

    // Update the selected item state when the isChecked prop changes
    useEffect(() => {
        setItemSelected(isChecked);
    }, [isChecked]);

    // Handle the delete button click
    const handleClick = () => {
        if (isItemSelected) {
            setPopupVisible(true)
        }
    };

    // Handle the cancel button click
    const handleCancel = () => {
        setPopupVisible(false);  // Hide the popup
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
                    disabled={!isItemSelected}
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