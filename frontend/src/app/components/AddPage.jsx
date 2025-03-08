/**************************************************************
 *
 *                     AddPage.jsx
 *
 *        Authors: Dan Glorioso & Massimo Bottari
 *           Date: 02/01/2025
 *
 *     Summary: The AddPage component is a form that allows users to
 *     add new items to the inventory. It has error checking for empty fields,
 *     and featured multi-select dropdowns for garment type, time period, 
 *     season, condition, and color. It also has a drag-and-drop image upload
 *     feature.
 * 
 **************************************************************/

"use client";

import { useState, useEffect } from 'react';
import "../globals.css";
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import StylishButton from './StylishButton.jsx';
import Link from 'next/link';
import { useGlobalContext } from './contexts/ToggleContext';

export default function AddPage() {

    // Left column state variables
    const [dragOver, setDragOver] = useState(false);
    const [preview, setPreview] = useState(null);

    // Right column state variables
    const { isToggleEnabled } = useGlobalContext(); // TOGGLE FUNCTIONALITY
    const [idText, setIDText] = useState("");
    const [placeholderDate, setPlaceholderDate] = useState("");
    const [manualIdText, setManualIdText] = useState("");
    const [manualDateText, setManualDateText] = useState("");


    const [itemText, setItemText] = useState("");
    const [locationText, setLocationText] = useState("");
    const [priceText, setPriceText] = useState("");
    const [notesText, setNotesText] = useState("");
    const [selectedGarment, setSelectedGarment] = useState("");
    const [selectedTimePeriod, setSelectedTimePeriod] = useState([]);
    const [ageSelection, setAgeSelection] = useState(null);
    const [genderSelection, setGenderSelection] = useState(null);
    const [selectedSize, setSelectedSize] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState([]);
    const [condition, setCondition] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);

    // "Overall" state variables
    const [errors, setErrors] = useState({});
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState("");

    // Define all of the options for buttons and dropdowns
    const garmentOptions = [
        { label: "Gowns/dresses", value: "Gowns/dresses" },
        { label: "Outerwear", value: "Outerwear" },
        { label: "Accessories", value: "Accessories" },
        { label: "Bottoms", value: "Bottoms" },
        { label: "Shoes", value: "Shoes" },
        { label: "Socks/hose", value: "Socks/hose" },
        { label: "Tops", value: "Tops" },
        { label: "Vests", value: "Vests" }
    ];
    const timePeriods = [
        { name: "Post-1920s" },
        { name: "Pre-1700s" },
        { name: "1750s-1800s" },
        { name: "1800s-1840s" }
    ];
    const ageOptions = [
        { value: "Youth", label: "Youth" },
        { value: "Adult", label: "Adult" }
    ];
    const genderOptions = [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
        { value: "Unisex", label: "Unisex" }
    ];
    const sizes = [
        { label: "Small", value: "Small" },
        { label: "Medium", value: "Medium" },
        { label: "Large", value: "Large" },
        { label: "X-Large", value: "X-large" }
    ];
    const seasons = [
        { label: "Fall", value: "Fall" },
        { label: "Winter", value: "Winter" },
        { label: "Spring", value: "Spring" },
        { label: "Summer", value: "Summer" }
    ];
    const conditions = [
        { name: "Needs repair" },
        { name: "Needs dry cleaning" },
        { name: "Needs washing" },
        { name: "Not usable" },
        { name: "Great" },
        { name: "Good" },
    ]
    const colors = [
        { name: "Red", hex: "#FF3B30" },
        { name: "Orange", hex: "#FF9500" },
        { name: "Yellow", hex: "#FFCC00" },
        { name: "Green", hex: "#34C759" },
        { name: "Blue", hex: "#5856D6" },
        { name: "Purple", hex: "#AF52DE" },
        { name: "Pink", hex: "#FF2D55" },
        { name: "Brown", hex: "#A2845E" },
        { name: "White", hex: "#FFFFFF", border: "#c9c9c9" },
        { name: "Gray", hex: "#8E8E93" },
        { name: "Black", hex: "#000000" },
      ];

    // Function to handle and update file selection
    const handleFileSelect = (file) => {
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(file);
        } else {
            alert("Please upload a valid image file.");
        }
    };

    // Function to handle drag-and-drop file upload
    const handleDrop = (event) => {
        event.preventDefault();
        setDragOver(false);
        const file = event.dataTransfer.files[0];
        handleFileSelect(file);
    };

    // Function to handle file input change
    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        handleFileSelect(file);
    };

    // Function to deal with a number input to format as a $ amount
    const handlePriceChange = (e) => {
        let value = e.target.value;
    
        // Remove any non-numeric characters except dot
        value = value.replace(/[^0-9.]/g, "");
    
        // Ensure only one decimal point
        const parts = value.split(".");
        if (parts.length > 2) {
            value = parts[0] + "." + parts.slice(1).join("");
        }
    
        setPriceText(value ? `$${value}` : "");
    };

    // Function to format price as currency
    const formatPrice = () => {
        if (priceText === "") return;
    
        // Convert to a fixed two-decimal format
        const formattedValue = parseFloat(priceText).toFixed(2);
    
        // Check is input is valid before setting state
        if (!isNaN(formattedValue)) {
            setPriceText(`$${numericValue.toFixed(2)}`);
        }
    };
    
    // Function to handle color selection
    const handleColorSelect = (color) => {
        // If color is already selected, remove it
        if (selectedColors.includes(color)) {
            setSelectedColors(selectedColors.filter((c) => c !== color));
        // If fewer than 2 colors are selected, add the new color
        } else if (selectedColors.length < 2) {
            setSelectedColors([...selectedColors, color]);
        }
    };

    const handleConditionSelect = (selectedConditions) => {
    
        // Ensure selectedConditions is always an array
        if (!Array.isArray(selectedConditions)) {
            setCondition([]); // Set to empty array if selection is cleared
            return;
        }
    
        // Extract only names, handling undefined values safely
        const selectedNames = selectedConditions.map(item => item?.name || "").filter(name => name !== "");
    
        // Update state
        setCondition(selectedNames);
    };

    const handleTimePeriodSelect = (selectedTimePeriods) => {    
        // Ensure selectedTimePeriods is always an array
        if (!Array.isArray(selectedTimePeriods)) {
            setSelectedTimePeriod([]); // Set to empty array if selection is cleared
            return;
        }
    
        // Extract only names
        const selectedNames = selectedTimePeriods.map(item => item?.name || ""); // Avoid undefined errors
    
        // Update state
        setSelectedTimePeriod(selectedNames.filter(name => name !== "")); // Remove any empty values
    };

    const handleSeasonSelect = (season) => {
        setSelectedSeason((prevSelected) => {
            if (prevSelected.includes(season)) {
                // Remove season if already selected
                return prevSelected.filter((s) => s !== season);
            } else if (prevSelected.length < 2) {
                // Add season if less than 2 are selected
                return [...prevSelected, season];
            } else {
                return prevSelected;
            }
        });
    };

    const handleSubmit = () => {
        
            setStatusMessage("Submitting...");
            setStatusType("neutral");


        const newItem = {
            id: isToggleEnabled ? manualIdText : idText,
            name: itemText,
            location: locationText || null,
            cost: priceText ? parseInt(priceText.replace('$', ''), 10): null,
            notes: notesText || null,
            garment_type: selectedGarment || null,
            time_period: selectedTimePeriod.length > 0 ? selectedTimePeriod : null, // Wrap in array if not null
            age_group: ageSelection || null,
            gender: genderSelection || null,
            size: selectedSize.length > 0 ? selectedSize : null,
            season: selectedSeason.length > 0 ? selectedSeason : null, // Wrap in array if not null
            condition: condition.length > 0 ? condition : null,
            color: selectedColors.length > 0 ? selectedColors : null,
            status: "Available", // Default status
            // authenticity_level: null,
            date_added: isToggleEnabled ? manualDateText : placeholderDate, 
            current_borrower: null,
            borrow_history: null
        };

        let newErrors = {};

        // Check for missing required fields and set error flags
        if (!isToggleEnabled) {
            if (!newItem.garment_type) newErrors.garment_type = true;
            if (!newItem.time_period) newErrors.time_period = true;
            if (!newItem.age_group) newErrors.age_group = true;
            if (!newItem.gender) newErrors.gender = true;
            if (!newItem.size) newErrors.size = true;
            if (!newItem.season) newErrors.season = true;
            if (!newItem.condition) newErrors.condition = true;
            if (!newItem.color) newErrors.color = true;
        }
        else {
            if (!newItem.id) newErrors.id = true;
        }
        if (!newItem.name) newErrors.name = true;

        // If any errors exist, update state and show alert
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setStatusMessage("Please fill out all required fields.");
            setStatusType("error");
            return;
        }

        // If no errors, clear previous errors and proceed
        setErrors({});

        // Validate date format if toggle is enabled
        if (isToggleEnabled) {
            // Allow blank inputs in addition to valid date formats
            const regex = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/\d{2,4}$/;
            if (manualDateText && !regex.test(manualDateText)) {
                alert("Please enter a valid date in the format mm/dd/yyyy.");
                return;
            }
        }

        // Send a POST request to the add API with body data
        const addItemDB = async (newItem) => {

            try {
                const response = await fetch(`/api/itemManagement?action=add`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newItem)
                });

                if (!response.ok) {
                    // Catch errors for duplicate item IDs
                    if (response.status === 427) {
                        setStatusMessage("An item with this ID already exists.");
                        setStatusType("error");
                    } else {
                        alert(`Error: ${data.error || "Request failed."}`);
                    }
                    return;
                }

            } catch (error) {
                setStatusMessage("An error occurred. Please try again.");
                setStatusType("error");
                return;
            }

            // If successful, show success message
            setStatusMessage("Item successfully added.");
            setStatusType("success");
        };

        // Call the function to send the API request
        addItemDB(newItem);

        // Reset form fields
        resetForm();
    };

    const resetForm = () => {
        // Reset form fields (states)
        setIDText("");
        setPlaceholderDate("");
        setItemText("");
        setLocationText(""); 
        setPriceText("");
        setNotesText("");
        setSelectedGarment("");
        setSelectedTimePeriod([]);
        setAgeSelection(null);
        setGenderSelection(null);
        setSelectedSize([]);
        setSelectedSeason([]);
        setCondition([]);
        setSelectedColors([]);
    };

    // TOGGLE FUNCTIONALITY
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch next available ID
                const response = await fetch('/api/inventoryQueries?action=getNextAvailableId');
                const data = await response.json();
                if (response.ok) {
                    setIDText(data.nextId);
                } else {
                    console.error(data.error);
                }

                // Set placeholder date
                const today = new Date();
                const month = String(today.getMonth() + 1).padStart(2, '0'); 
                const day = String(today.getDate()).padStart(2, '0');
                const year = today.getFullYear();
                setPlaceholderDate(`${month}/${day}/${year}`);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="main">
            <div className="column">

                {/* Left column */}
                <div className="left">
                    <div className="title">
                        Add Item
                    </div>

                    {/* Drag-and-drop image upload section */}
                    <div className="image-upload">
                        <div
                            id="drop-zone"
                            className={`drop-zone ${dragOver ? "dragover" : ""}`}
                            onClick={() => document.getElementById("file-input").click()}
                            onDragOver={(event) => {
                                event.preventDefault();
                                setDragOver(true);
                            }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            >
                            <div className="upload-icon-and-text">
                            <img src="/icons/upload.svg" className="upload-icon" />
                                <p style={{color: "#9B525F"}}>
                                    Upload image
                                </p>
                            </div>
                            <input
                                type="file"
                                id="file-input"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleFileInputChange}
                            />
                            {preview && (
                                <img
                                src={preview}
                                alt="Preview"
                                className="preview"
                                />
                            )}
                        </div>

                        <div className="textBoxRow">
                            
                        {/* Item Name Text Entry */}
                        <div className="inputGroup">
                            <h3 htmlFor="itemTB" className={errors.name ? "error-text" : ""}>
                                Item Name*
                            </h3>
                            <input
                                className="itemTextBox"
                                placeholder="Enter Name"
                                id="itemTB"
                                value={itemText}
                                onChange={(e) => setItemText(e.target.value)}
                            />
                        </div>

                        {/* Location Text Entry */}
                        <div className="inputGroup">
                            <label htmlFor="locationTB" className="textLabel">Location</label>
                            <input
                                className="locationTextBox"
                                placeholder=""
                                id="locationTB"
                                value={locationText}
                                onChange={(e) => setLocationText(e.target.value)}
                            />
                        </div>
                    </div>

                        
                        {/* ID, Date Added, and Price Text Entries */}
                        <div className="textBoxRow">
                            <div className="allID">
                                <div className={errors.id ? "error-text idName" : "idName"}>
                                    {isToggleEnabled ? "ID*" : "ID"}
                                </div>
                                <div className="idTextBox">
                                    <textarea 
                                        type="text"
                                        placeholder={isToggleEnabled ? "Enter ID" : "Loading..."}
                                        value={isToggleEnabled ? manualIdText : idText}
                                        onChange={(e) => {
                                            if (isToggleEnabled) {
                                                setManualIdText(e.target.value);
                                            }
                                        }}
                                        readOnly={!isToggleEnabled}
                                        style={{ background: isToggleEnabled ? "#FFF" : "var(--grayed_out)" }}
                                    />
                                </div>
                            </div>

                            <div className="allDate">
                                <div className={`dateName`}>
                                    {isToggleEnabled ? "Date Added" : "Date Added"}
                                </div>
                                <div className="dateTextBox">
                                    <textarea 
                                        placeholder={isToggleEnabled ? "MM/DD/YYYY" : "Loading..."}
                                        value={isToggleEnabled ? manualDateText : placeholderDate}
                                        onChange={(e) => {
                                            if (isToggleEnabled) {
                                                setManualDateText(e.target.value);
                                            }
                                        }}
                                        readOnly={!isToggleEnabled}
                                        style={{ background: isToggleEnabled ? "#FFF" : "var(--grayed_out)" }}
                                    />
                                </div>
                            </div>
                            <div className="allPrice">
                                <div className={`priceName`}>
                                    Price
                                </div>
                                <div className="priceInput">
                                <input 
                                    type="text"
                                    placeholder="$0.00"
                                    id="priceTB"
                                    value={priceText}
                                    onChange={(e) => handlePriceChange(e)}
                                    onBlur={formatPrice}
                                />
                                </div>
                            </div>
                        </div>

                        <div className={`notesName`}>
                            Notes
                        </div>

                        <div className="notesTextBox">
                            <textarea placeholder="Extra item information not captured by tags (i.e. fabric type, or where it was bought from)."
                            id = "notesTB"
                            value={notesText}
                            onChange={(e) => setNotesText(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                
                {/* Middle Vertical Divider */}
                <div className="divider"></div>

                {/* Right Column */}
                <div className="right">

                    {/* Garment and Time Section */}
                    <div className="garment-and-time">
                    
                        {/* Garment Title and Dropdown */}
                        <div className="dropdown-component">
                            <h3 className={errors.garment_type ? "error-text" : ""}>
                                {isToggleEnabled ? "Garment Type" : "Garment Type*"}
                            </h3>
                            <Dropdown
                                value={selectedGarment}
                                options={garmentOptions}
                                onChange={(e) => setSelectedGarment(e.value)}
                                placeholder="Select Garment Type"
                                className="dropdown"
                            />
                        </div>

                        {/* Time Period Title and Dropdown */}
                        <div className="dropdown-component">
                            <h3 className={errors.time_period ? "error-text" : ""}>
                                {isToggleEnabled ? "Time Period" : "Time Period*"}
                                <span style={{fontWeight: "400"}}> (Max of 2)</span>
                            </h3>                            
                                <MultiSelect
                                    value={timePeriods.filter(period => selectedTimePeriod.includes(period.name))} // Sync selected values
                                    options={timePeriods}
                                    onChange={(e) => handleTimePeriodSelect(e.value || [])}
                                    optionLabel="name" 
                                    display="chip" 
                                    maxSelectedLabels={2}
                                    placeholder="Select Time Period"
                                    className="dropdown"
                                    showSelectAll={false}
                                />
                        </div>
                    </div>
                    
                    {/* Age and Gender Buttons */}
                    <div className="age-and-gender">
                        {/* Age Buttons */}
                        <div className="allAge">
                            <h3 className={errors.age_group ? "error-text" : ""}>
                                {isToggleEnabled ? "Age Group" : "Age Group*"}
                            </h3>
                            <div className="ageButtons p-selectbutton">
                                {ageOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        className={`p-button ${ageSelection === option.value ? "selected" : ""}`}
                                        onClick={() => setAgeSelection(option.value)}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Gender Buttons */}
                        <div className="allGender">
                            <h3 className={errors.gender ? "error-text" : ""}>
                                {isToggleEnabled ? "Sex" : "Sex*"}
                            </h3>
                            <div className="genderButtons p-selectbutton">
                                {genderOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        className={`p-button ${genderSelection === option.value ? "selected" : ""}`}
                                        onClick={() => setGenderSelection(option.value)}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Size Buttons */}
                    <div className="size-buttons p-selectbutton">
                        <h3 className={errors.size ? "error-text" : ""}>
                            {isToggleEnabled ? "Size" : "Size*"}
                        </h3>
                        {sizes.map((option) => (
                            <button 
                                key={option.value} 
                                className={`p-button ${selectedSize === option.value ? "selected" : ""}`}
                                onClick={() => setSelectedSize(option.value)}
                                >
                                    {option.label} 
                            </button>
                        ))}
                    </div>

                    <div className="season-buttons p-selectbutton">
                        <h3 className={errors.season ? "error-text" : ""}>
                            {isToggleEnabled ? "Season" : "Season*"}
                            <span style={{ fontWeight: "400" }}> (Max of 2)</span>
                        </h3>
                        {seasons.map((option) => (
                            <button
                                key={option.value}
                                className={`p-button ${selectedSeason.includes(option.value) ? "selected" : ""}`}
                                onClick={() => handleSeasonSelect(option.value)}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    {/* Condition Dropdown */}
                    <div className="condition-component">
                        <div className="dropdown-component">
                            <h3 className={errors.condition ? "error-text" : ""}>
                                {isToggleEnabled ? "Condition" : "Condition*"}
                                <span style={{fontWeight: "400"}}> (Max of 2)</span>
                            </h3> 
                            <MultiSelect
                                value={conditions.filter(cond => condition.includes(cond.name))} // Sync selected values
                                options={conditions}
                                onChange={(e) => handleConditionSelect(e.value || [])}
                                optionLabel="name" 
                                display="chip" 
                                maxSelectedLabels={2}
                                placeholder="Select Condition"
                                className="dropdown"
                                showSelectAll={false}
                            />
                        </div>
                    </div>
                            
                    {/* Color Selector */}
                    <div className="color-component">
                        <div className="color-dropdown">
                            <h3 className={errors.color ? "error-text" : ""}>
                                {isToggleEnabled ? "Color" : "Color*"}
                                <span style={{fontWeight: "400"}}> (Max of 2)</span>
                            </h3> 
                            <div className="color-selector">
                                <div className="color-options">
                                    {colors.map((color) => (
                                    <div
                                        key={color.name}
                                        className={`color-circle ${selectedColors.includes(color.name) ? "selected" : ""}`}
                                        style={{
                                        backgroundColor: color.hex,
                                        border: color.border ? `2px solid ${color.border}` : "none",
                                        }}
                                        onClick={() => handleColorSelect(color.name)}
                                    ></div>
                                    ))}
                                </div>
                                <p className="selected-text">
                                    Selected: {selectedColors.length > 0 ? selectedColors.join(", ") : "None"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>  

            <div className="cancel-submit">
                {/* Status Message */}
                <div className={`statusMessage ${statusType}`}>
                    {statusMessage}
                </div>

                {/* Cancel and Submit Buttons */}
                <div className="cancel-submit-buttons">
                    <Link href="/inventory">
                        <StylishButton className="cancel-button" styleType="style1" label="Cancel" />
                    </Link>

                    <StylishButton className="submit-button" onClick={handleSubmit} styleType="style3" label="Submit" />
                </div>
            </div>
        </div>
    );
}