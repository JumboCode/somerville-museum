"use client";

import React from "react";
import "./Dropdown.css"

const Dropdown = (props) => { /* Props has element label with the label for dropdown name */

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