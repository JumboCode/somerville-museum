import React, { useState, useRef, useEffect } from 'react';
import './Filter.css';
import { useFilterContext } from "../contexts/FilterContext.js" 
import Calendar from '../../assets/Calendar.jsx';
import Reset from '../../assets/Reset.jsx';
import Dropdown from '../../assets/Dropdown.jsx';
import CalendarPicker from '../Calendar/CalendarPicker.jsx';

const FilterComponent = ({ isVisible, onClose, className }) => {
    const { selectedFilters, setSelectedFilters } = useFilterContext();
    const fields = {
        Condition: {
            options: ["Great", "Needs washing", "Needs repair", "Needs dry cleaning", "Not usable"]
        }, 
        Gender: {
            options: ["Male", "Female", "Unisex"]
        }, 
        Color: {
            options: ["Red", "Black", "Blue", "Green", "Purple", "Yellow", "Pink", "Gray", "Brown", "Orange", "White"]
        }, 
        Type: {
            options: ["Winter", "Summer", "Spring", "Fall"]
        }, 
        Size: {
            options: ["One Size", "Small", "Medium", "Large"]
        }, 
        Time_Period: {
            options: ["1800s - 1840s", "1750s - 1800s", "Post-1910s", "Pre-1700s"]
        },
    };
    const checkboxFields = {
        Status: {
            options: ["Available", "Overdue", "Borrowed", "Missing"]
        },
        Season: {
            options: ["Winter", "Summer", "Spring", "Fall"]
        } 
    }
    // Initialize an object to all "" for filtering later on on the backend
    let baseOptions = {}
    Object.keys(fields).map((key) => {
        baseOptions = {...baseOptions, [key.toLowerCase()]: []}
    })

    baseOptions = {
        ...baseOptions,
        status: [],
        season: [],
        return_date: "NOT NULL"
    }
    const [openDropdowns, setOpenDropdowns] = useState({});
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('Select...');
    const [selectedOptions, setSelectedOptions] = useState(baseOptions);
    const dropdownRefs = useRef({});
    const checkboxRefs = useRef({});
    const calendarRef = useRef(null);

    useEffect(() => {
        setSelectedFilters(selectedOptions);
    }, [selectedOptions]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            Object.keys(dropdownRefs.current).forEach(key => {
                if (dropdownRefs.current[key] && !dropdownRefs.current[key].contains(event.target)) {
                    setOpenDropdowns(prev => ({...prev, [key]: false}));
                }
            });

            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setIsCalendarOpen(false);
            }
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

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setSelectedOptions((curr) => ({
            ...curr, return_date: date
        }))
    };

    // Now enables multiple options to be selected
    const handleOptionSelect = (label, option) => {
        const formattedLabel = label.toLowerCase().replaceAll(" ", "_");
        setSelectedOptions(prev => {
            const currentValues = prev[formattedLabel];
            const valueExists = currentValues.includes(option);
            
            return {
                ...prev,
                [formattedLabel]: valueExists 
                    ? currentValues.filter(item => item !== option)  // Remove if exists
                    : [...currentValues, option]  // Add if doesn't exist
            };
        });
    };

    // now enables multiple checkboxes to be selected
    const updateCheckboxes = (field, value) => (e) => {
        setSelectedOptions((current) => {
            const currentValues = current[field];
            if (e.target.checked) {
                return {
                    ...current,
                    [field]: [...currentValues, value]
                };
            } else {
                return {
                    ...current,
                    [field]: currentValues.filter(item => item !== value)
                };
            }
        });
    };

    return (
        <div className={`filter-component ${isVisible ? 'visible' : ''} ${className}`}>
            <div className="filters">
                <div className="filter-section">
                    <h2>Status</h2>
                    <div className="status-grid">
                    {checkboxFields.Status.options.map((status) => (
                        <label key={status}>
                            <input 
                                type="checkbox" 
                                checked={selectedOptions.status.includes(status)}
                                onChange={updateCheckboxes("status", status)}
                            />
                            {status}
                        </label>
                    ))}
                    </div>
                </div>

                {Object.keys(fields).map((label) => {
                    let currLabel = selectedOptions[label.toLowerCase().replaceAll(" ", "_")];
                    return (
                    <div key={label} className="filter-section">
                        <h2>{label.replaceAll("_", " ")}</h2>
                        <div 
                            className="custom-select"
                            ref={el => dropdownRefs.current[label] = el}
                        >
                            <div 
                                className={`select-box ${openDropdowns[label] ? 'active' : ''}`}
                                onClick={() => toggleDropdown(label)}
                            >
                                <span>
                                    {currLabel.length === 0 
                                        ? 'Select...' 
                                        : currLabel.join(', ')}
                                </span>
                                <Dropdown className={`dropdown-icon ${openDropdowns[label] ? 'rotated' : ''}`} />
                            </div>

                            {openDropdowns[label] && (
                                <ul className='dropdown-options'>
                                    {fields[label].options.map((option) => (
                                        <li 
                                            key={option} 
                                            onClick={() => handleOptionSelect(label, option)}
                                            className={selectedOptions[label.toLowerCase()].includes(option) ? 'selected' : ''}
                                        >
                                            {option}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )})}

                <div className="filter-section">
                    <h2>Season</h2>
                    <div className="season-grid">
                    {checkboxFields.Season.options.map((season) => (
                        <label key={season}>
                            <input 
                                type="checkbox" 
                                checked={selectedOptions.season.includes(season)}
                                onChange={updateCheckboxes("season", season)}
                            />
                            {season}
                        </label>
                    ))}
                    </div>
                </div>

                <div className="filter-section">
                    <h2>Return Date</h2>
                    <div className="date-select-container">
                        <div className="custom-select">
                            <div 
                                className="select-box"
                                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                            >
                                <span>{selectedDate}</span>
                                <Calendar className="calendar-icon" />
                            </div>
                            <CalendarPicker 
                                isOpen={isCalendarOpen}
                                onClose={() => setIsCalendarOpen(false)}
                                onDateSelect={handleDateSelect}
                                ref={calendarRef}
                            />
                        </div>
                    </div>
                </div>
                <div>
                <button className="reset-button">
                    <Reset />
                    <p>Reset</p>
                </button>
                </div>
            </div>
        </div>
    );
};

export default FilterComponent;