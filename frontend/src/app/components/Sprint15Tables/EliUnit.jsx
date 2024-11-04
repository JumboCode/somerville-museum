"use client";
import "./EliUnit.css";

// Add props to this component if needed
export default function ELiUnit() {
    return (
        <div className="unit"> 
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
            <div className="id">123XYZ</div>
            <div className="name">Big Chungus</div>
            <div className="status">Available</div>
            <div className="tags"></div>
            <div className="drop-down">
                {/* to do ask about icons fontawesome?*/}
                <button></button>
            </div>
        </div>
    );
}
