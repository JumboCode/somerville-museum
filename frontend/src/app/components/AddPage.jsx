"use client"; // This file is client-side

import { useState, useEffect } from 'react';
import "../globals.css";
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { SelectButton } from 'primereact/selectbutton';

export default function AddPage() {
    const [dragOver, setDragOver] = useState(false);
    const [preview, setPreview] = useState(null);
    const [itemName, setItemName] = useState('');
    const [id, setId] = useState('');
    const [date, setDate] = useState('');
    const [price, setPrice] = useState('');
    const [note, setNote] = useState('');
    const [selectedGarment, setSelectedGarment] = useState("");
    const [selectedTimePeriod, setSelectedTimePeriod] = useState("");
    const [selectedSize, setSelectedSize] = useState([]);
    const [Season, setSeason] = useState([]);
    const [condition, setCondition] = useState([]);
    const [color, setColor] = useState([]);
    const [text, setText] = useState("");

    const [ageSelection, setAgeSelection] = useState(null);
    const [adultSelection, setAdultSelection] = useState(null);
    const [genderSelection, setGenderSelection] = useState(null);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedChoice, setSelectedChoice] = useState([]);

    const ageOptions = ["Youth", "Adult"];
    const genderOptions = ["Male", "Female", "Unisex"];
    const seasons = ["Fall", "Winter", "Spring", "Summer"];
    const conditions = ["Needs repair", "Needs dry cleaning", "Needs washing", "Not usable", "Great"];
    const garments = [
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
    const sizes = [
        { label: "Small", value: "small" },
        { label: "Medium", value: "medium" },
        { label: "Large", value: "large" },
        { label: "X-Large", value: "x-large" }
    ];

    const cancelOrSubmit = ["Cancel", "Submit"];
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

    // Placeholder Current Date
    const [placeholderDate, setPlaceholderDate] = useState('');
    useEffect(() => {
        // Get today's date
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0'); 
        const day = String(today.getDate()).padStart(2, '0');
        const year = today.getFullYear();

        // Format the date as MM/DD/YYYY
        setPlaceholderDate(`${month}/${day}/${year}`);
    }, []);

    const handleGarmentSelection = (value) => {
        setGarmentTag(value);
    };

    const handleFileSelect = (file) => {
        if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);
        } else {
        alert("Please upload a valid image file.");
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragOver(false);
        const file = event.dataTransfer.files[0];
        handleFileSelect(file);
    };

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        handleFileSelect(file);
    };

    const handleTimePeriodSelection = (value) => {
        setTimeTag(value);
    };

    const handleChange = (event) => {
        setText(event.target.value);
    };

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
                        {/* start making other boxes for left column here */}

                        <label htmlFor="textBox"></label>
                        <div className="itemTextBox">
                            <textarea placeholder=""></textarea>
                        </div>

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
                                options={garments}
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


                    {/* Size Buttons */}
                    <div className="size-buttons">
                        <h3>Season*<span style={{fontWeight: "400"}}> (Max of 2)</span></h3> 
                        <SelectButton value={selectedSeason} onChange={(e) => setSelectedSeason(e.value)} options={seasons} />
                    </div>

                    {/* Condition Dropdown */}
                    <div className="condition-component">
                        <div className="condition-dropdown">
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
