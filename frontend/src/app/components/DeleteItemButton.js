"use client";  // This directive marks the component as a Client Component

import { useEffect, useState } from "react";
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
        setPopupVisible(false);
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
        setPopupVisible(false);

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
                <StylishButton
                    label = "Delete"
                    styleType="style1"
                    onClick={handleClick}
                >
                </StylishButton>

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