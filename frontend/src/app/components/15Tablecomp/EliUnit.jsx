"use client";
import "./EliUnit.css";

// Add unit to this component if needed
export default function ELiUnit( { unit, onChange } ) {
    const { id, name, status, tags } = unit;

    return (
        <div className="unit"> 
            <div className="left-section">
                <div className="check-box">
                    <input type="checkbox" id="customCheckbox" className="checkbox-input"
                    onChange={(e) => onChange(unit.id, e.target.checked)}/>
                </div>
                <div className="picture">
                    <div className="image-container">
                        <img src="" alt="Profile" />
                    </div>
                </div>
            </div>
            <div className="id"> {unit.id} </div>
            <div className="name">{unit.name}</div>
            <div className="status">{unit.status}</div>
            <div className="tags"></div>
            <div className="drop-down">
                {/* to do ask about icons fontawesome?*/}
                <button></button>
            </div>
        </div>
    );
}
