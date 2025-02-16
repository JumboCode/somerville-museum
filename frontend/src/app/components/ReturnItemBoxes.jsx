// InventoryUnit.jsx
"use client";
import { useState, useEffect, useRef, forwardRef} from "react";
import "./ReturnButton.css";
import StylishButton from "./StylishButton";

export default function ItemBoxes({ unit, onNotesChange, itemId }) {
    const [notes, setNotes] = useState("");

    // Add a condition to make sure `unit` is defined
    if (!unit) {
        return null; // Don't render anything if `unit` is undefined
    }

    const { id, tags, name, condition} = unit; 

    const handleNotesChange = (event) => {
        setNotes(event.target.value);
        onNotesChange(unit.id, event.target.value);
    };

    //not pulling tags
    console.log(unit.tags);  
    return (  
        <div className="returnItem">
            <div className="itemID">
                <div className="thisIsInPlaceOfAnImage"></div>
                <div className="itemInfo">
                    <p>{unit.name}</p>
                    <p>ID #{unit.id}</p>
                </div>
                <StylishButton className="exit" styleType ="style4"
                    label = {<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <path d="M21.7774 2.29391L19.6627 0.179199L11.2788 8.56305L2.89498 0.179199L0.780273 2.29391L9.16412 10.6778L0.780273 19.0616L2.89498 21.1763L11.2788 12.7925L19.6627 21.1763L21.7774 19.0616L13.3935 10.6778L21.7774 2.29391Z" fill="black"/>
                    </svg>}>
                </StylishButton>
            </div>
            <div className="notesWrapper">
                <p>Notes</p>
                <form>
                    <input type="text" className="notesTextbox" name="notes" 
                        value = {notes} onChange = {handleNotesChange}></input>
                </form>
            </div>
            <div className="conditionWrapper">
            <p>Condition*</p> 
                <select name="condition" className="conditionDropdown">
                    <option className="dropdownContent" value="needs">Needs Dry Cleaning</option>
                    {/* add more condition tags */}
                </select>
            </div>
        </div>
    );
}