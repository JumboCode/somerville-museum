// InventoryUnit.jsx
"use client";
import { useState, useEffect } from "react";
import Popup from "./Popup";
import "./InventoryUnit.css";

export default function InventoryUnit({ unit, onChange, checked }) {
    // Add a condition to make sure `unit` is defined
    if (!unit) {
        return null; // Don't render anything if `unit` is undefined
    }

    const { id, name, status, tags, condition } = unit; 
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const handleClick = () => {
        setIsPopupVisible(true);
    }

    const handleClosePopup = () => {
        setIsPopupVisible(false);
    }

    const handleClickOutside = (event) => {
        if (
            event.target.closest('.sidebar') === null &&
            event.target.closest('.unit') === null

        ) {
            setIsPopupVisible(false);
        }
    }

    useEffect(() => {
        if (isPopupVisible) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [isPopupVisible]);
    if(checked){
        console.log("IOSFJNFAS", checked);
    }
    return (  
        <div className="unit" onDoubleClick={handleClick}> 
            <div className="left-section">
            <div className="check-box">
                <input 
                    type="checkbox" 
                    id={`customCheckbox-${id}`} 
                    className="checkbox-input" 
                    checked={checked} 
                    onChange={(e) => onChange(unit, e.target.checked)} 
                    
                />
                </div>
                <div className="picture">
                    <div className="image-container">
                        <img src="" alt="Profile" />
                    </div>
                </div>
            </div>
            <div className="center-section">
                <div className="id"> {unit.id} </div>
                <div className="name">{unit.name}</div>
                <div className="status">
                    <div className={`circle ${unit.status}`} ></div>
                    {unit.status}
                </div>
                <div className="condition">{unit.condition}</div>
                <div className="tags">
                    {tags && tags.length > 0 && tags.map((tag, index) => (
                            <span key={index} className="tag">
                                {tag}
                            </span>
                        ))}
                </div>
            </div>
            <div className="drop-down">
                <button className="drop-downBtn" onClick={handleClick}>•••</button>
            </div>
            <div>
                { isPopupVisible && (
                    <Popup unit={unit} onClose={handleClosePopup} />
                )}
            </div>
        </div>
    );
}