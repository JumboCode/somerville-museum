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
        Garment_Type: {
            options: ["Gowns/dresses", "Outerwear", "Accessories", "Bottoms", "Shoes", "Socks/hose", "Tops", "Vests"]
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
        return_date: { start: null, end: null }
    }
    const [openDropdowns, setOpenDropdowns] = useState({});
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [dateRange, setDateRange] = useState({ start: null, end: null });
    const [selectedOptions, setSelectedOptions] = useState(selectedFilters);
    const dropdownRefs = useRef({});
    const checkboxRefs = useRef({});
    const calendarRef = useRef(null);
    const calendarPickerContainerRef = useRef(null);
    
    // Keep selectedOptions in sync with selectedFilters
    useEffect(() => {
        if (JSON.stringify(selectedOptions) !== JSON.stringify(selectedFilters)) {
            setSelectedOptions(selectedFilters);
            if (selectedFilters.return_date) {
                setDateRange({
                    start: selectedFilters.return_date.start,
                    end: selectedFilters.return_date.end
                });
            }
        }
    }, [selectedFilters, selectedOptions]);

    // Handle updates to selectedOptions
    const updateFilters = (newOptions) => {
        // Only update if there's an actual change
        if (JSON.stringify(newOptions) !== JSON.stringify(selectedFilters)) {
            setSelectedOptions(newOptions);
            setSelectedFilters(newOptions);
        }
    };

    const handleReset = () => {
        const resetOptions = {
            ...baseOptions,
            return_date: { start: null, end: null }
        };
        updateFilters(resetOptions);
        setDateRange({ start: null, end: null });
        
        // Use the calendar ref to reset the calendar UI state
        if (calendarRef.current && calendarRef.current.resetCalendar) {
            calendarRef.current.resetCalendar();
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Handle dropdown clicks
            Object.keys(dropdownRefs.current).forEach(key => {
                if (dropdownRefs.current[key] && !dropdownRefs.current[key].contains(event.target)) {
                    setOpenDropdowns(prev => ({...prev, [key]: false}));
                }
            });

            // Handle calendar clicks - make sure we're not clicking on the calendar icon or within the calendar
            const isClickInCalendarButton = event.target.closest('.calendar-icon') || 
                event.target.closest('.select-box');
            
            const isClickInCalendarPicker = calendarPickerContainerRef.current && 
                calendarPickerContainerRef.current.contains(event.target);
                
            if (!isClickInCalendarButton && !isClickInCalendarPicker && isCalendarOpen) {
                setIsCalendarOpen(false);
            }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isCalendarOpen]);
    
    const toggleDropdown = (label) => {
        setOpenDropdowns(prev => ({
            ...prev,
            [label]: !prev[label]
        }));
    };

    // Updated to handle date range selection with proper formatting
    const handleDateRangeSelect = (startDate, endDate) => {
        // Convert date strings to standardized format for consistent backend processing
        // If null values are passed, keep them as null
        const formattedStartDate = startDate || null;
        const formattedEndDate = endDate || null;
        
        setDateRange({ start: startDate, end: endDate });
        updateFilters({
            ...selectedOptions,
            return_date: { 
                start: formattedStartDate, 
                end: formattedEndDate 
            }
        });
    };

    // Now enables multiple options to be selected
    const handleOptionSelect = (label, option) => {
        const formattedLabel = label.toLowerCase().replaceAll(" ", "_");
        const currentValues = selectedOptions[formattedLabel] || [];
        const valueExists = currentValues.includes(option);
        
        updateFilters({
            ...selectedOptions,
            [formattedLabel]: valueExists 
                ? currentValues.filter(item => item !== option)
                : [...currentValues, option]
        });
    };
    
    const updateCheckboxes = (field, value) => (e) => {
        const currentValues = selectedOptions[field] || [];
        updateFilters({
            ...selectedOptions,
            [field]: e.target.checked
                ? [...currentValues, value]
                : currentValues.filter(item => item !== value)
        });
    };

    // Format date range display text
    const getDateRangeText = () => {
        if (dateRange.start && dateRange.end) {
            return `${dateRange.start} - ${dateRange.end}`;
        } else if (dateRange.start) {
            return `${dateRange.start} - Select end date`;
        } else {
            return 'Select date range...';
        }
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
                    <h2>Return Date Range</h2>
                    <div className="date-select-container" ref={calendarPickerContainerRef}>
                        <div className="custom-select">
                            <div 
                                className="select-box"
                                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                            >
                                <span>{getDateRangeText()}</span>
                                <Calendar className="calendar-icon" />
                            </div>
                            {isCalendarOpen && (
                                <CalendarPicker 
                                    isOpen={isCalendarOpen}
                                    onClose={() => setIsCalendarOpen(false)}
                                    onDateSelect={handleDateRangeSelect}
                                    ref={calendarRef}
                                    initialStartDate={dateRange.start}
                                    initialEndDate={dateRange.end}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    <button className="reset-button" onClick={handleReset}>
                        <Reset />
                        <p>Reset</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterComponent;