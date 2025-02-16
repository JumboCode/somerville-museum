'use client'

import React, { useState, useEffect } from "react";
import StylishButton from './StylishButton.jsx'; //import css file

const getBorrowerEmail = async (borrowerId) => {
    try {
        const response = await fetch(`/api/fetchBorrowerEmail?id=${borrowerId}`);
        if (!response.ok) throw new Error(`Failed to fetch borrower email`);

        const data = await response.json();
        return data.borrower_email;
    } catch (error) {
        console.error("Error fetching borrower email:", error);
        return null;
    }
};

const ReturnButton = ({ selectedItems = [], onSuccess }) => {  
    const handleSubmit = async (e) => {
        console.log("Return button clicked with selected items:", selectedItems);

        if (selectedItems.length === 0) {
            console.warn("No items selected for return.");
            return;
        }

        const firstItem = selectedItems[0];  
        const borrowerId = firstItem?.current_borrower;
        console.log("Borrower ID:", borrowerId);

        if (!borrowerId) {
            console.error("No borrower ID found.");
            return;
        }

        // Fetch borrower email
        const borrowerEmail = await getBorrowerEmail(borrowerId);
        console.log("Borrower Email:", borrowerEmail);

        if (!borrowerEmail) {
            console.error("No borrower email found, skipping email send.");
            return;
        }

        try {
            // COMMENTED OUT RETURN API CALL FOR EMAIL TESTING

            // Call the return API first
            // const response = await fetch('../../api/return', {  
            //     method: 'PUT',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({ 
            //         selectedItems: selectedItems.map(item => item.id)  
            //     })
            // });

            // console.log("Return API response status:", response.status);

            // if (!response.ok) {
            //     throw new Error(`Fetch error: ${response.status} - ${response.statusText}`);
            // }

            // const result = await response.json(); 

            // console.log("Return API result:", result);

            // if (result.message) {
            //     alert(result.message);  // Display success message
            // }

            console.log("Sending return confirmation email...");
        
            const emailResponse = await fetch("/api/sendReturnEmail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    borrower_name: firstItem.name || "Borrower",
                    borrower_email: borrowerEmail,
                    returned_items: selectedItems.map(item => item.name),
                }),
            });

            if (!emailResponse.ok) {
                throw new Error(`Email sending failed: ${emailResponse.status} - ${await emailResponse.text()}`);
            }

            console.log("Return confirmation email sent successfully!");

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error("Error in return process:", error);
        }
    }

    return (
        <div>
            <StylishButton label="Return" styleType="style1" onClick={handleSubmit}/>
        </div>
    );
}

export default ReturnButton;
