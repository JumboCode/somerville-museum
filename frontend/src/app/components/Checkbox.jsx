"use client";

import React, { useState } from "react";
import "./Checkbox.css";

const Checkbox = (props) => { /* Props has element label with the label for dropdown name */

    const [color, setColor] = useState("#ffffff");

    const handleClick = () => {
        setColor(color === "#ffffff" ? "#8d0722" : "#ffffff");
    }

    return (
        <div className="checkbox">
            <button className="checkbox-button" onClick={handleClick} style={{backgroundColor: color}}> ✓ </button>
            <p className="check-text">{props.label}</p>
        </div>
    );
};

export default Checkbox;