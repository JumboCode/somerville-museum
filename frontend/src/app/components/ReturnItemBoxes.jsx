"use client";
import { useState } from "react";
import "./ReturnButton.css";
import Image from "next/image";
import { MultiSelect } from 'primereact/multiselect';

export default function ItemBoxes({ unit, onNotesChange, itemId, onClose }) {
    const [notes, setNotes] = useState("");
    const [condition, setCondition] = useState([]);

    const [errors, setErrors] = useState({});

    if (!unit) {
        return null;
    }

    const conditions = [
        { name: "Needs repair" },
        { name: "Needs dry cleaning" },
        { name: "Needs washing" },
        { name: "Not usable" },
        { name: "Great" },
        { name: "Good" },
    ]

    const handleNotesChange = (event) => {
        setNotes(event.target.value);
        onNotesChange(unit.id, event.target.value);
    };

    const handleConditionSelect = (selectedConditions) => {
    
        // Ensure selectedConditions is always an array
        if (!Array.isArray(selectedConditions)) {
            // Set to empty array if selection is cleared
            setCondition([]); 
            return;
        }
    
        // Extract only names, handling undefined values safely
        const selectedNames = selectedConditions.map(item => item?.name || "").filter(name => name !== "");
    
        // Update state
        setCondition(selectedNames);
    };

    //not pulling tags
    return (  
        <div className="returnItem">
            <div className="itemID">
            <div className="return-image">
                {Array.isArray(unit.image_keys) && unit.image_keys.length > 0 ? (
                    <Image 
                        src={`https://upload-r2-assets.somerville-museum1.workers.dev/${unit.image_keys[0]}`} 
                        fill
                        alt="No image found"
                    />
                ) : (
                    <p>No image found</p>
                )}
            </div>
                <div className="itemInfo">
                    <h2>{unit.name}</h2>
                    <h2>ID #{unit.id}</h2>
                </div>
                <button className="exitBtn" 
                    onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <path d="M21.7774 2.29391L19.6627 0.179199L11.2788 8.56305L2.89498 0.179199L0.780273 2.29391L9.16412 10.6778L0.780273 19.0616L2.89498 21.1763L11.2788 12.7925L19.6627 21.1763L21.7774 19.0616L13.3935 10.6778L21.7774 2.29391Z" fill="black"/>
                    </svg>
                </button>
            </div>
            <div className="notesWrapper">
                <h3>Notes</h3>
                <form>
                    <textarea className="notesTextbox" name="notes" 
                        value = {notes} onChange = {handleNotesChange}></textarea>
                </form>
            </div>

            {/* Condition Dropdown - shoutout Massimo and Dan */}
            <div className="condition-component">
                <div className="dropdown-component">
                    <h3 className={errors.condition ? "error-text" : ""}>Condition*</h3>
                    <MultiSelect
                        // Sync selected values
                        value={conditions.filter(cond => condition.includes(cond.name))} 
                        options={conditions}
                        onChange={(e) => handleConditionSelect(e.value || [])}
                        optionLabel="name" 
                        display="chip" 
                        maxSelectedLabels={2}
                        placeholder="Select Condition"
                        className="dropdown"
                        showSelectAll={false}
                    />
                </div>
            </div>
        </div>
    );
}