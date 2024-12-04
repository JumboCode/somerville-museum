"use client";
import "./EliUnit.css";
import { useState, useEffect } from "react";
import Popup from "./Popup";

// Add unit to this component if needed
export default function ELiUnit( { unit } ) {
    const { id, name, status, tags } = unit;
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

    return (
        
        <div className="unit" onDoubleClick={handleClick}> 
            <div className="left-section">
                <div className="check-box">
                    <input type="checkbox" id="customCheckbox" className="checkbox-input"/>
                </div>
                <div className="picture">
                    <div className="image-container">
                        <img src="" alt="Profile" />
                    </div>
                </div>
            </div>
            <div className="center-section">
                <div className="id"> {unit.id} </div>
                <div className="status">
                    <div className={`circle ${unit.status}`} ></div>
                    {unit.status}
                </div>
                <div className="name">{unit.name}</div>
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

            {isPopupVisible && (
                <Popup unit={unit} onClose={handleClosePopup}  />
            )}
        </div>
    );
}
