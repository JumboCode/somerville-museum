import React, { useState, useRef, useEffect } from 'react';
import './Filter.css';
import Calendar from '../../assets/Calendar.jsx';
import Reset from '../../assets/Reset.jsx';
import Dropdown from '../../assets/Dropdown.jsx';

const FilterComponent = ({ isVisible, onClose, className }) => {
    const [openDropdowns, setOpenDropdowns] = useState({});
    const dropdownRefs = useRef({});

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            Object.keys(dropdownRefs.current).forEach(key => {
                if (dropdownRefs.current[key] && !dropdownRefs.current[key].contains(event.target)) {
                    setOpenDropdowns(prev => ({...prev, [key]: false}));
                }
            });
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = (label) => {
        setOpenDropdowns(prev => ({
            ...prev,
            [label]: !prev[label]
        }));
    };

    return (
        <div className={`filter-component ${isVisible ? 'visible' : ''} ${className}`}>
            <div className="filters">
                <div className="filter-section">
                    <h2>Status</h2>
                    <div className="status-grid">
                        <label><input type="checkbox" />Available</label>
                        <label><input type="checkbox" />Overdue</label>
                        <label><input type="checkbox" />Borrowed</label>
                        <label><input type="checkbox" />Missing</label>
                    </div>
                </div>

                {['Condition', 'Gender', 'Color', 'Type', 'Size', 'Time Period'].map((label) => (
                    <div key={label} className="filter-section">
                        <h2>{label}</h2>
                        <div 
                            className="custom-select"
                            ref={el => dropdownRefs.current[label] = el}
                        >
                            <div 
                                className={`select-box ${openDropdowns[label] ? 'active' : ''}`}
                                onClick={() => toggleDropdown(label)}
                            >
                                <span>Select...</span>
                                <Dropdown className={`dropdown-icon ${openDropdowns[label] ? 'rotated' : ''}`} />
                            </div>
                            {openDropdowns[label] && (
                                <ul className="dropdown-options">
                                    <li>Option 1</li>
                                    <li>Option 2</li>
                                    <li>Option 3</li>
                                </ul>
                            )}
                        </div>
                    </div>
                ))}

                <div className="filter-section">
                    <h2>Season</h2>
                    <div className="season-grid">
                        {['Winter', 'Spring', 'Summer', 'Fall'].map((season) => (
                            <label key={season}>
                                <input type="checkbox" />{season}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="filter-section">
                    <h2>Return Date</h2>
                    <div className="custom-select">
                        <div className="select-box">
                            <span>Select...</span>
                            <Calendar className="calendar-icon" />
                        </div>
                    </div>
                </div>

                <button className="reset-button">
                    <Reset />
                    <p>Reset</p>
                </button>
            </div>
        </div>
    );
};

export default FilterComponent;