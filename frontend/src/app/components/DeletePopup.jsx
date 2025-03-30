
/**************************************************************
 *
 *                     DeletePopup.jsx
 *
 *        Authors: Dan Glorioso & Hannah Jiang & Zack White
 *           Date: 02/16/2025
 *
 *     Summary: The popup that appears when the user clicks the delete button
 *              in the inventory page. This file just displays the popup and
 *              does not execute the delete query.
 * 
 **************************************************************/

import React from "react";
import "./DeletePopup.css";
import { useState, useEffect } from "react";

const DeletePopup = ({ onConfirm, onCancel, selectedItems }) => {
    const [isClosing, setIsClosing] = useState(false);

    const handleCancel = () => {
        setIsClosing(true);
        setTimeout(() => {
            onCancel();
        }, 200);
    };

    const handleDelete = () => {
        setIsClosing(true);
        setTimeout(() => {
            onConfirm();
        }, 200);
    };

    // Add Escape key listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                handleCancel();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // Create list of ID, separated by commas
    const itemDetails = selectedItems.map(item => `${item.id}: ${item.name}`).join(", ");
    
    return (
      <div className={`deleteContainer ${isClosing ? 'fade-out' : 'fade-in'}`}>
            <div className={`deleteContent`}>
                <img src="/icons/important.svg" className="importantIcon"/>
                <h2>Delete Item(s)</h2>
                <p>Are you sure you want to delete the following item(s)?</p>

                <p style={{ fontWeight: 700 }}>
                    {itemDetails}
                </p>

                <p>You can&apos;t undo this action.</p>

                <div className="buttons">
                    <button onClick={handleCancel} className="cancel-button confirmCancel">Cancel</button>
                    <button onClick={handleDelete} className="confirm-button confirmDelete">Delete</button>
                </div>
            </div>
        </div>
    );
  };

  export default DeletePopup;