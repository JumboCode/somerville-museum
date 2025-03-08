/**************************************************************
 *
 *                     EditPage.jsx
 *
 *        Authors: Dan Glorioso & Massimo Bottari
 *           Date: 02/01/2025
 *
 *     Summary: A component that allows users to edit an existing item in the
 *              database. It fetches the current data for the item, populates 
 *              the fields with that data, and allows users to modify it,
 *              and submit the changes.
 * 
 **************************************************************/

"use client";

import { useState, useEffect } from 'react';
import "../globals.css";
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import StylishButton from './StylishButton';
import Link from 'next/link';


export default function EditPage() {
    // Left column state variables
    const [dragOver, setDragOver] = useState(false);
    const [preview, setPreview] = useState(null);

    // Right column state variables
    const [idText, setIDText] = useState("");
    const [itemText, setItemText] = useState("");
    const [priceText, setPriceText] = useState("");
    const [notesText, setNotesText] = useState("");
    const [selectedGarment, setSelectedGarment] = useState("");
    const [selectedTimePeriod, setSelectedTimePeriod] = useState([]);
    const [ageSelection, setAgeSelection] = useState([]);
    const [genderSelection, setGenderSelection] = useState([]);
    const [selectedSize, setSelectedSize] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState([]);
    const [condition, setCondition] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);

    // "Overall" state variables
    const [selectedChoice ] = useState([]);
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
        { name: "1750s - 1800s" },
        { name: "1800s - 1840s" }
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
        { value: "Small", label: "Small" },
        { value: "Medium", label: "Medium" },
        { value: "Large", label: "Large" },
        { value: "X-Large", label: "X-Large" }
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
    const cancelOrSubmit = ["Cancel", "Submit"];

    // Fetch placeholder for current date
    const [placeholderDate, setPlaceholderDate] = useState('');
    useEffect(() => {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0'); 
        const day = String(today.getDate()).padStart(2, '0');
        const year = today.getFullYear();
        setPlaceholderDate(`${month}/${day}/${year}`);
    }, []);

    // Function to handle and update file selection
    const handleFileSelect = (file) => {
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(file);
            setStatusMessage("Image uploaded successfully.");
            setStatusType("success");
        } else {
            setStatusMessage("Error: Invalid file type. Please upload an image.");
            setStatusType("error");
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
            setCondition([]);
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
            setSelectedTimePeriod([]);
            return;
        }
    
        // Extract only names
        const selectedNames = selectedTimePeriods.map(item => item?.name || "");
    
        // Update state
        setSelectedTimePeriod(selectedNames.filter(name => name !== ""));
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

    // Fetch data from the API about the item to edit
    const retrieveItem = async () => {
        setStatusMessage("Retrieving item data...");
        setStatusType("neutral");
    
        try {
            const response = await fetch(`/api/itemManagement?action=retrieve&id=${idText}`);
    
            // Custom error handling for no item found
            if (response.status === 428) {
                setStatusMessage("Error: Item ID does not exist.");
                setStatusType("error");
                return;
            }
    
            if (!response.ok) {
                throw new Error('Error fetching data');
            }
    
            // Parse response as JSON
            const data = await response.json();
    
            // Populate state with retrieved data
            setIDText(data.id);
            setItemText(data.name);
            setPlaceholderDate(data.date_added);
            setPriceText(data.cost ? `$${data.cost}` : "");
            setNotesText(data.notes);
            setSelectedGarment(data.garment_type);
            setSelectedTimePeriod(data.time_period || []);
            setAgeSelection(data.age_group || []);
            setGenderSelection(data.gender || []);
            setSelectedColors(data.color || []);
            setSelectedSeason(data.season || []);
            setSelectedSize(data.size || []);
            setCondition(data.condition || []);
    
        } catch (error) {
            console.error('Error fetching item data:', error);
            setStatusMessage("Error fetching item data. Please try again.");
            setStatusType("error");
        }

        // Reset status message after retrieval
        setStatusMessage("");
        setStatusType("neutral");
    };
    
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const itemId = urlParams.get('id');
        if (itemId) {
            retrieveItem(itemId);
        }
    }, []);
    

    const handleSubmit = () => {
        setStatusMessage("Updating...");
        setStatusType("neutral");

        const newItem = {
            id: idText,
            name: itemText || null,
            cost: priceText ? parseInt(priceText.replace('$', ''), 10) : null,
            notes: notesText || null,
            garment_type: selectedGarment || null,
            time_period: selectedTimePeriod.length > 0 ? selectedTimePeriod : null,
            age_group: ageSelection || null,
            gender: genderSelection || null,
            size: selectedSize.length > 0 ? selectedSize : null,
            season: selectedSeason.length > 0 ? selectedSeason : null,
            condition: condition.length > 0 ? condition : null,
            color: selectedColors.length > 0 ? selectedColors : null,
            status: "Available",
            location: null,
            date_added: placeholderDate,
            current_borrower: null,
            borrow_history: null
        };
    
        let newErrors = {};
    
        // Required fields check
        if (!newItem.name) newErrors.name = true;
        if (!newItem.garment_type) newErrors.garment_type = true;
        if (!newItem.time_period) newErrors.time_period = true;
        if (!newItem.age_group) newErrors.age_group = true;
        if (!newItem.gender) newErrors.gender = true;
        if (!newItem.size) newErrors.size = true;
        if (!newItem.season) newErrors.season = true;
        if (!newItem.condition) newErrors.condition = true;
        if (!newItem.color) newErrors.color = true;
        if (!newItem.date_added) newErrors.date_added = true;
    
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setStatusMessage("Please fill out all required fields.");
            setStatusType("error");
            return;
        }
    
        setErrors({});
    
        const updateItem = async () => {
            try {
                const response = await fetch(`../../api/inventoryQueries?action=updateItem`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newItem),
                });
    
                const data = await response.json();
    
                if (!response.ok) {
                    if (response.status === 428) {
                        setStatusMessage("Error: ID is missing.");
                    } else if (response.status === 500) {
                        setStatusMessage("Internal server error. Please try again.");
                    } else {
                        setStatusMessage(`Error: ${data.error || "Unknown error"}`);
                    }
                    setStatusType("error");
                    return;
                }
    
                if (response.status === 201) {
                    setStatusMessage("Item successfully added.");
                } else {
                    setStatusMessage("Item successfully updated.");
                }
                setStatusType("success");
    
            } catch (error) {
                console.error('Error updating item:', error);
                setStatusMessage("An error occurred. Please try again.");
                setStatusType("error");
            }
        };
    
        updateItem();
    };    

    // Reset form fields
    const resetForm = () => {
        setIDText("");
        setItemText("");
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

    return (
        <div className="main">
            <div className="column">

                {/* Left column */}
                <div className="left">
                    <div className="title">
                        Edit Item
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
                                <p style={{color: "#9B525F"}}>Upload image*</p>
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
                        <div className={`itemName ${errors.name ? "error-text" : ""}`}>
                            Item Name*
                        </div>

                        {/* Item Name Text Entry */}
                        <label htmlFor="textBox"></label>
                        <div className="itemTextBox">
                            <textarea placeholder=""
                            id = "itemTB"
                            value={itemText}
                            onChange={(e) => setItemText(e.target.value)}
                            />
                        </div>
                        
                        {/* ID, Date Added, and Price Text Entries */}
                        <div className="textBoxRow">
                            <div className="allID">
                                <div className={`idName ${errors.name ? "error-text" : ""}`}>
                                    ID
                                </div>
                                <div className="idTextBox">
                                    <textarea 
                                        type="text"
                                        value={idText}
                                        placeholder="1256"
                                        onChange={(e) => setIDText(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="allDate">
                                <div className={`dateName ${errors.name ? "error-text" : ""}`}>
                                    Date Added
                                </div>
                                <div className="dateTextBox">
                                    <textarea placeholder={placeholderDate}></textarea>
                                </div>
                            </div>
                            <div className="allPrice">
                                <div className={`priceName ${errors.name ? "error-text" : ""}`}>
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

                        <div className={`notesName ${errors.name ? "error-text" : ""}`}>
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
                            <h3 className={errors.garment_type ? "error-text" : ""}>Garment Type*</h3>
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
                            <h3 className={errors.time_period ? "error-text" : ""}>Time Period*<span style={{fontWeight: "400"}}> (Max of 2)</span></h3>                            
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
                            <h3 className={errors.age_group ? "error-text" : ""}>Age Group*</h3>
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
                            <h3 className={errors.gender ? "error-text" : ""}>Sex*</h3>
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
                        <h3 className={errors.size ? "error-text" : ""}>Size*</h3>
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
                            Season* <span style={{ fontWeight: "400" }}> (Max of 2)</span>
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
                            <h3 className={errors.condition ? "error-text" : ""}>Condition*<span style={{fontWeight: "400"}}> (Max of 2)</span></h3> 
                            <MultiSelect
                                value={conditions.filter(cond => condition.includes(cond.name))} // Sync selected values
                                options={conditions}
                                onChange={(e) => handleConditionSelect(e.value || [])} // Ensure `e.value` is never undefined
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
                            <h3 className={errors.color ? "error-text" : ""}>Color*<span style={{fontWeight: "400"}}> (Max of 2)</span></h3> 
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

                    <StylishButton className="submit-button" onClick={() => handleSubmit()} styleType="style3" label="Submit" />
                </div>
            </div>
        </div>
    );
}