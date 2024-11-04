"use client";

import React from "react";
import "./Filters.css";
import Checkbox from "./Checkbox";
import Dropdown from "./Dropdown";

const Filter = () => {


    return (
        <div className="filters" >
          <Checkbox label="All" />
          <Checkbox label="Available" />
          <Checkbox label="Borrowed" />
          <Checkbox label="Overdue" />
          <Dropdown label="Type" />
          <Dropdown label="Size" /> 
          <Dropdown label="Color" />
          <Dropdown label="Gender" />
        </div>
    );
};

export default Filter