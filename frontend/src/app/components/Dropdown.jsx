"use client";

import React from "react";
import "./Dropdown.css"

const Dropdown = (props) => {
    return (
        <div className="dropdown">
            <p className="dropdown-title">{props.label}</p>
            <select className="dropdown-select">
                <option className="dropdown-option">???</option>
            </select>
        </div>
    );
};

export default Dropdown;