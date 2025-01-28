"use client";
import "./PrePopup.css";


export default function PrePopup({ onClose, onOptionSelect }) {
    const handleEditClick = () => {
        onOptionSelect("edit");
        onClose(); 
    };

    const handleExpandClick = () => {
        onOptionSelect("expand"); 
        onClose(); 
    };

    return (
        <div className="Popup">
            <div className="Header">
                Would You Like To Edit or See The Item In Expanded View? 
                <div className="Buttons">
                <button className="popupBtn" onClick={handleEditClick}> 
                    Edit! </button>
                <button className="popupBtn" onClick={handleExpandClick}> 
                    Go to Expanded View! </button>
            </div>
            </div>
            
        </div>
    );
}
