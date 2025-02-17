"use client";

import React, { useState } from "react";
import "./Checkbox.css";

const Checkbox = (props) => { /* Props has element label with the label for dropdown name */

    const [color, setColor] = useState("#FFFFFF");
    const [checked, setChecked] = useState("#FFFFFF")

    const handleClick = () => {
        setColor(color === "#FFFFFF" ? "#9B525F" : "#FFFFFF");
        setChecked(color === "##FFFFFF" ? "#ffffff" : "#FFFFFF")
    }

    return (
        <div className="checkbox">
            <button className="checkbox-button" onClick={handleClick} style={{backgroundColor: color, color: checked}}> ✓ </button>
            <p className="check-text">{props.label}</p>
        </div>
    );
};

export default Checkbox;