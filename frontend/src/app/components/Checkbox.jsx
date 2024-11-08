"use client";

import React, { useState } from "react";
import "./Checkbox.css";

const Checkbox = (props) => { /* Props has element label with the label for dropdown name */

    const [color, setColor] = useState("#D9D9D9");
    const [checked, setChecked] = useState("#D9D9D9")

    const handleClick = () => {
        setColor(color === "#D9D9D9" ? "#9B525F" : "#D9D9D9");
        setChecked(color === "##D9D9D9" ? "#ffffff" : "#D9D9D9")
    }

    return (
        <div className="checkbox">
            <button className="checkbox-button" onClick={handleClick} style={{backgroundColor: color, color: checked}}> ✓ </button>
            <p className="check-text">{props.label}</p>
        </div>
    );
};

export default Checkbox;