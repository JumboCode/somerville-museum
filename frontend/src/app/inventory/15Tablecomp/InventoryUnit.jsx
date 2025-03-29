// InventoryUnit.jsx
"use client";
import { useState, useEffect, useRef, forwardRef} from "react";
import Popup from "./Popup";
import PrePopup from "./PrePopup";
import Image from "next/image"
import "./InventoryUnit.css";

export default function InventoryUnit({ unit, onChange, checked }) {

    const { id, name, status, age_group, gender, color, season, garment_type, size, time_period, condition, cost, authenticity_level, location, date_added, borrow_history, notes, image_keys} = unit; 
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isPrePopupVisible, setIsPrePopupVisible] = useState(false);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);

    const handleDoubleClick = () => {
        setIsPopupVisible(true);
    }

    const handleClick = () => {
        setIsPrePopupVisible(true);
        console.log("prepopupvisible" + isPrePopupVisible)
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPopupPosition({
                top: rect.bottom + window.scrollY - 5, // Position below button
                right: rect.right + window.scrollX - 1413, // Align right with button
            });
        }
    }

    const handleClosePrePopup = () => {
        setIsPrePopupVisible(false);
    } 

    const handleClosePopup = () => {
        setIsPopupVisible(false);
    }

    const handleClickOutside = (event) => {
        if (
            event.target.closest('.sidebar') === null &&
            event.target.closest('.unit') === null
        ) {
            setTimeout(() => setIsPrePopupVisible(false), 100); // Delay to allow re-opening
        } 
    };

    //CALL BACK FOR PREPOPUP
    const handlePopupOption = (option) => {
        if (option === "expand") {
            console.log("in expand " + isPopupVisible)
            setIsPopupVisible(true);
        } else if (option === "Missing" || option === "Available") {
            setAsMissingFound(option);
        } 
        setIsPrePopupVisible(false);
    }

    const setAsMissingFound = async (option) => {
        try {
            const response = await fetch(`../../../api/db`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: 'UPDATE dummy_data SET status=$1 WHERE id=$2',
                    params: [option, id],
                }),
            });

            if (!response.ok) {
                throw new Error(`Fetch error: ${response.status} - ${response.statusText}`);
            }
            window.location.reload();
        } catch (error){
            alert("An error occurred. Please try again.");
            return;
        }
    };

    useEffect(() => {
        if (isPopupVisible || isPrePopupVisible) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [isPopupVisible]);

        // Add a condition to make sure `unit` is defined
        if (!unit) {
            return null; // Don't render anything if `unit` is undefined
        }

    if(checked) {
        console.log("Items Checked?", checked);
    }

    //not pulling tags
    return (  
        <div className="unit" onDoubleClick={handleDoubleClick}> 
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
                        {image_keys && image_keys.length > 0 && <Image 
                            src={`https://upload-r2-assets.somerville-museum1.workers.dev/${image_keys[0]}`} 
                            fill
                            alt="No image found"
                        />}
                        <img src={null} alt="Profile" />
                    </div>
                </div>
            </div>
            <div className="center-section">
                <div className="id"> {unit.id} </div>
                <div className="name">{unit.name}</div>
                <div className="status">
                    <div className={`circle1 ${unit.status}`} ></div>
                    {unit.status}
                </div>
                <div className="condition">
                    <div className={`circle2 ${Array.isArray(unit.condition) ? unit.condition[0] : unit.condition}`} ></div>
                        {Array.isArray(unit.condition) ? unit.condition[0] : unit.condition}
                </div>

            </div>
            <div className="tags">
                <div className="gender">{unit.gender}</div>
                <div className="season">{unit.season}</div>
                <div className="size">{unit.size}</div>
                <div className="time">
                    {Array.isArray(unit.time_period) && unit.time_period.length > 0 ? (
                        unit.time_period.map((period, index) => (
                            <span key={index}>{period}{index < unit.time_period.length - 1 ? ', ' : ''}</span>
                        ))
                    ) : (
                        'No time periods available'
                    )}
                </div>
            </div>
            <div className="drop-down">
                <button className="drop-downBtn" 
                        onClick={handleClick}
                        ref = {buttonRef}
                        >•••</button>
                { isPrePopupVisible && (
                    <PrePopup onClose={handleClosePrePopup} 
                        onOptionSelect={handlePopupOption}
                        position = {popupPosition}
                        status = {status}
                        unit={unit}/>
                )}   

                { isPopupVisible && (
                <Popup unit={unit} onClose={handleClosePopup} />
                )}    
            </div>
        </div>
    );
}