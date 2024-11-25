// InventoryUnit.jsx
"use client";
import "./InventoryUnit.css";

export default function InventoryUnit({ unit }) {
    // Add a condition to make sure `unit` is defined
    if (!unit) {
        return null; // Don't render anything if `unit` is undefined
    }

    const { id, name, status, tags } = unit;

    return (
        <div className="unit">
            <div className="left-section">
                <div className="check-box">
                    <input type="checkbox" id="customCheckbox" className="checkbox-input" />
                </div>
                <div className="picture">
                    <div className="image-container">
                        <img src="" alt="Profile" />
                    </div>
                </div>
            </div>
            <div className="id"> {id} </div>
            <div className="name">{name}</div>
            <div className="status">{status}</div>
            <div className="tags">{tags}</div>
            <div className="drop-down">
                <button></button>
            </div>
        </div>
    );
}