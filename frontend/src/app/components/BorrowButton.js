'use client'

import Popup from 'reactjs-popup';

import React, { useState } from "react";
import SelectItemButton from "./SelectItem";

const BorrowButton = () => {
    const [selectedItems, setSelectedItems] = useState(''); 
    const [isOpen, setIsOpen] = useState(false); 

    // Function to open and close the popup
    const openPopup = () => setIsOpen(true);
    const closePopup = () => setIsOpen(false);

    // const handleSelectItem 

    return (
        <div> 
           <button onClick={openPopup}> Borrow </button>
            <Popup 
                open={isOpen}
                onClose={closePopup}
                modal
                nested> 

                <form> 
                    <label> 
                        <SelectItemButton />
                    </label>
                </form>

                <ls>
                    <label> Selected Items: </label>
                    {/* display selected Items */}
                </ls>

                <div>
                    <button onClick={closePopup}>Exit</button>
                </div>

            </Popup>
        </div>
    )
}

export default BorrowButton; 