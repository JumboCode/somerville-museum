"use client";

import React from "react";
import "./Filters.css";
import Checkbox from "./Checkbox";
import Dropdown from "./Dropdown";

const Filter = () => {


    return (
        <div className="filters" >
          <p className="filters-title">Filters</p>
          <div className="checkboxes">
            <Checkbox label="All" />
            <Checkbox label="Available" />
            <Checkbox label="Borrowed" />
            <Checkbox label="Overdue" />
            <Checkbox label="Missing" />
          </div>
          <div className="dropdowns">
            <Dropdown label="Century" />
            <Dropdown label="Type" />
            <Dropdown label="Size" /> 
            <Dropdown label="Color" />
            <Dropdown label="Gender" />
          </div>
        </div>
    );
};

export default Filter