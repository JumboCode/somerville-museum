'use client'

import Popup from 'reactjs-popup';

import React, { useState } from "react";
import SelectItemButton from "./SelectItem";
import ReturnDropdown from './BorrowDropdown';

const BorrowButton = () => {
    const [selectedItems, setSelectedItems] = useState(''); 
    const [isOpen, setIsOpen] = useState(false); 
    const [borrowerName, setBorrowerName] = useState(' ');
    const [email, setEmail] = useState(' '); 

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
                <hr/>

                <ls>
                    <label> Selected Items: </label>
                    {/* display selected Items */}
                </ls>
                

                <form> 
                    <hr/>
                    <label>
                        Borrower Name: 
                        <input
                            name="borrowerName"
                            value={borrowerName}
                            onChange={(e) => setBorrowerName(e.target.value)}
                        />
                        
                    </label>
                    <hr/>
                    <label>
                        Borrower Email: 
                        <input
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>
                    <hr/>
                    <label>
                        <ReturnDropdown/>


                    </label>



                </form>

                <div>
                    <button onClick={closePopup}>Exit</button>
                </div>

            </Popup>
        </div>
    )
}



export default BorrowButton; 




// function returnDropdown() {
//   return (
//     <DropdownButton id="dropdown-retrun-button" title="Dropdown button">
//       <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
//       <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
//       <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
//     </DropdownButton>
//   );
// }
