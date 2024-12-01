'use client'

import React, { useState, useEffect } from "react";
import StylishButton from './StylishButton.jsx'; //import css file

const ReturnButton = ({selectedItems = [], onSuccess }) => {
    console.log('the selected items are: ', selectedItems);

    const handleSubmit = async (e) => {
        console.log('in handle submit'); 
        try {
            const response = await fetch('../../api/return', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    selectedItems: selectedItems.map(item => item.id)
                })
            });
            
            if (!response.ok) {
                throw new Error(`Fetch error: ${response.status} - ${response.statusText}`);
            }

            const result = await response.json(); 

            if (result.message) {
                alert(result.message);  
            }

            if (onSuccess) {
                onSuccess(); 
            }
        }
        catch (error) {
            console.error("Error returning data:", error);
        }
    }

    return (
        <div>
            <StylishButton label="Return" styleType="style1" onClick={handleSubmit}/>
        </div>
    )
}

export default ReturnButton;