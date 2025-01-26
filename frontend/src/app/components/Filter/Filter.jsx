import React from 'react';
import './Filter.css';
import Checkbox from "../../components/Checkbox";
import Dropdown from "../../components/Dropdown";

const FilterComponent = ({ isVisible, onClose, className }) => {
    return (
        <div className={`filter-component ${isVisible ? 'visible' : ''} ${className}`}>
            <div className="filters">
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
        </div>
    );
};

export default FilterComponent;