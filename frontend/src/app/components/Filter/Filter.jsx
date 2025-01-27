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
                    <Checkbox label="Available" />
                    <Checkbox label="Borrowed" />
                    <Checkbox label="Overdue" />
                    <Checkbox label="Missing" />
                </div>
                <div className="dropdowns">
                    <Dropdown label="Condition" />
                    <Dropdown label="Gender" />
                    <Dropdown label="Color" /> 
                    <Dropdown label="Type" />
                    <Dropdown label="Size" />
                    <Dropdown label="Time Period" />
                </div>
                <div className="checkboxes">
                    <Checkbox label="Winter" />
                    <Checkbox label="Spring" />
                    <Checkbox label="Summer" />
                    <Checkbox label="Fall" />
                </div>
                {/* Return Date */}
                {/* Reset */}
            </div>
        </div>
    );
};

export default FilterComponent;