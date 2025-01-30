"use client"; // This file is client-side

import { useState, useEffect } from 'react';
import "../globals.css";
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { SelectButton } from 'primereact/selectbutton';

export default function AddPage() {
    // Left column state variables
    const [dragOver, setDragOver] = useState(false);
    const [preview, setPreview] = useState(null);

    // Right column state variables
    const [selectedGarment, setSelectedGarment] = useState("");
    const [selectedTimePeriod, setSelectedTimePeriod] = useState("");
    const [ageSelection, setAgeSelection] = useState(null);
    const [genderSelection, setGenderSelection] = useState(null);
    const [selectedSize, setSelectedSize] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [condition, setCondition] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedChoice, setSelectedChoice] = useState([]);

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
    const ageOptions = ["Youth", "Adult"];
    const genderOptions = ["Male", "Female", "Unisex"];
    const sizes = [
        { label: "Small", value: "small" },
        { label: "Medium", value: "medium" },
        { label: "Large", value: "large" },
        { label: "X-Large", value: "x-large" }
    ];
    const seasons = ["Fall", "Winter", "Spring", "Summer"];
    const conditions = ["Needs repair", "Needs dry cleaning", "Needs washing", "Not usable", "Great"];
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

    // Function to handle color selection
    const handleSelect = (color) => {
        if (selectedColors.includes(color)) {
            setSelectedColors(selectedColors.filter((c) => c !== color));
        } else if (selectedColors.length < 2) {
            setSelectedColors([...selectedColors, color]);
        }
    };

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
                        <div className="itemName">
                            Item Name*
                        </div>

                        {/* Item Name Text Entry */}
                        <label htmlFor="textBox"></label>
                        <div className="itemTextBox">
                            <textarea placeholder=""></textarea>
                        </div>
                        
                        {/* ID, Date Added, and Price Text Entries */}
                        <div className="textBoxRow">
                            <div className="allID">
                                <div className="idName">
                                    ID
                                </div>
                                <div className="idTextBox">
                                    <textarea placeholder="1256"></textarea>
                                </div>
                            </div>
                            
                            <div className="allDate">
                                <div className="dateName">
                                    Date Added
                                </div>
                                <div className="dateTextBox">
                                    <textarea placeholder={placeholderDate}></textarea>
                                </div>
                            </div>
                            <div className="allPrice">
                                <div className="priceName">
                                    Price
                                </div>
                                <div className="priceTextBox">
                                    <textarea placeholder=""></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="notesName">
                            Notes
                        </div>

                        <div className="notesTextBox">
                            <textarea placeholder="Extra item information not captured by tags (i.e. fabric type, or where it was bought from)."></textarea>
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
                            <h3>Garment Type*</h3>
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
                            <h3>Time Period*<span style={{fontWeight: "400"}}> (Max of 2)</span></h3>                            
                                <MultiSelect
                                    value={selectedTimePeriod} 
                                    onChange={(e) => setSelectedTimePeriod(e.value)}
                                    options={timePeriods} 
                                    optionLabel="name" 
                                    display="chip" 
                                    placeholder="Select Time Period" 
                                    maxSelectedLabels={2}
                                    className="dropdown" 
                                />
                        </div>
                    </div>
                    
                    {/* Age and Gender Buttons */}
                    <div className="age-and-gender">

                        {/* Age Buttons */}
                        <div className="allAge">
                            <h3>Age Group*</h3>
                            <div className="ageButtons">
                                <SelectButton
                                    value={ageSelection} 
                                    options={ageOptions}
                                    onChange={(e) => setAgeSelection(e.value)} 
                                    ariaLabel="Age Selection" 
                                    classname="ageButtons"
                                />
                            </div>
                        </div>

                        {/* Gender Buttons */}
                        <div className="allGender">
                            <h3>Gender*</h3>
                            <div className="genderButtons">
                                    <SelectButton 
                                        value={genderSelection} 
                                        options={genderOptions}
                                        onChange={(e) => setGenderSelection(e.value)} 
                                        ariaLabel="Gender Selection" 
                                    />
                            </div>
                        </div>
                    </div>

                    {/* Size Buttons */}
                    <div className="size-buttons">
                        <h3>Size*</h3>
                        <SelectButton 
                            value={selectedSize} 
                            onChange={(e) => setSelectedSize(e.value)} 
                            options={sizes} 
                        />
                    </div>

                    {/* Season Buttons */}
                    <div className="size-buttons">
                        <h3>Season*<span style={{fontWeight: "400"}}> (Max of 2)</span></h3> 
                        <SelectButton 
                            value={selectedSeason} 
                            onChange={(e) => setSelectedSeason(e.value)} 
                            options={seasons} />
                    </div>

                    {/* Condition Dropdown */}
                    <div className="condition-component">
                        <div className="dropdown-component">
                            <h3>Condition*<span style={{fontWeight: "400"}}> (Max of 2)</span></h3> 
                            <Dropdown
                                value={condition}
                                options={conditions}
                                onChange={(e) => setCondition(e.value)}
                                placeholder="Select Condition"
                                className="dropdown"
                            />
                        </div>
                    </div>
                            
                    {/* Color Selector */}
                    <div className="color-component">
                        <div className="color-dropdown">
                            <h3>Color*<span style={{fontWeight: "400"}}> (Max of 2)</span></h3> 
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
                                        onClick={() => handleSelect(color.name)}
                                    ></div>
                                    ))}
                                </div>
                                <p className="selected-text">
                                    Selected: {selectedColors.length > 0 ? selectedColors.join(", ") : "None"}
                                </p>
                                </div>
                            
                        </div>
                    </div>

                        <div className="cancel-submit">
                            <div className="cancel-submit-buttons">
                                <div className="ageButton">
                                    <SelectButton 
                                        value={selectedChoice} 
                                        onChange={(e) => setSelectedChoice(e.value)} 
                                        options={cancelOrSubmit}
                                        
                                    />
                                </div>
                            </div>           
                        </div>
                </div>
            </div>    
        </div>
    );
}
