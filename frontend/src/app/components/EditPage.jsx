/**************************************************************
 *
 *                     EditPage.jsx
 *
 *        Authors: Dan Glorioso & Massimo Bottari
 *        Created: 02/01/2025
 *       Modified: 05/11/2025 by DG
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
import { useGlobalContext } from './contexts/ToggleContext';
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function EditPage({ unit }) {
    // Left column state variables
    const [dragOver, setDragOver] = useState(false);
    const [preview, setPreview] = useState([]);
    const [imageID, setImageID] = useState([]); // For image UUIDs
    const [prevImageID, setPrevImageID] = useState([]); // For previous image UUIDs

    // Extract the unit details
    const { id, name, age_group, gender, color, season, garment_type, size, time_period, condition, cost, notes} = unit; 

    // Right column state variables
    const { isToggleEnabled } = useGlobalContext(); // TOGGLE FUNCTIONALITY
    const [idText, setIDText] = useState(id);
    const [itemText, setItemText] = useState(name);
    const [priceText, setPriceText] = useState(cost);
    const [notesText, setNotesText] = useState(notes);
    const [selectedGarment, setSelectedGarment] = useState(garment_type);
    const [selectedTimePeriod, setSelectedTimePeriod] = useState(time_period);
    const [ageSelection, setAgeSelection] = useState(age_group);
    const [genderSelection, setGenderSelection] = useState(gender);
    const [selectedSize, setSelectedSize] = useState(size);
    const [selectedSeason, setSelectedSeason] = useState(season);
    const [conditionOption, setconditionOption] = useState(condition);
    const [selectedColors, setSelectedColors] = useState(color);

    // "Overall" state variables
    const [selectedChoice ] = useState([]);
    const [errors, setErrors] = useState({});
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState("");
    const [activeDragIndex, setActiveDragIndex] = useState(null); // Tracks which slot is being dragged over

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
    const conditionOptions = [
        { name: "Needs repair" },
        { name: "Needs dry cleaning" },
        { name: "Needs washing" },
        { name: "Not usable" },
        { name: "Great" },
        { name: "Good"}
    ];
    const colors = [
        { name: "Red", hex: "#FF3B30" },
        { name: "Orange", hex: "#FF9500" },
        { name: "Yellow", hex: "#FFCC00" },
        { name: "Green", hex: "#34C759" },
        { name: "Blue", hex: "#5856D6" },
        { name: "Purple", hex: "#AF52DE" },
        { name: "Pink", hex: "#FF93B7" },
        { name: "Brown", hex: "#A2845E" },
        { name: "White", hex: "#FFFFFF", border: "#c9c9c9" },
        { name: "Gray", hex: "#8E8E93" },
        { name: "Black", hex: "#000000" },
      ];

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
        if (!file) {
            alert("Please upload a valid image file.");
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Please upload a valid image file.");
            return;
        }

        // File size check based on global var
        if (file.size > MAX_FILE_SIZE_BYTES) {
            alert(`File "${file.name}" exceeds the ${MAX_FILE_SIZE_MB}MB limit.`);
            return;
        }

        if (preview.length >= 2) {
            alert("You can only upload 2 images per item.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => setPreview(prev => [...prev, e.target.result]);
        reader.readAsDataURL(file);

        // Generate UUID for uploaded image
        setImageID(prev => [...prev, uuidv4()]);
    };

    // Function to handle drag-and-drop file upload
    const handleDrop = (event) => {
        event.preventDefault();
        setDragOver(false);
        setActiveDragIndex(null);
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

    // const handleConditionSelect = (selectedConditions) => {
    
    //     // Ensure selectedconditionOptions is always an array
    //     if (!Array.isArray(selectedconditionOptions)) {
    //         setconditionOption([]);
    //         return;
    //     }
    
    //     // Extract only names, handling undefined values safely
    //     const selectedNames = selectedconditionOptions.map(item => item?.name || "").filter(name => name !== "");
    
    //     // Update state
    //     setconditionOption(selectedNames);
    // };

    // const handleTimePeriodSelect = (selectedTimePeriods) => {    
    //     // Ensure selectedTimePeriods is always an array
    //     if (!Array.isArray(selectedTimePeriods)) {
    //         setSelectedTimePeriod([]);
    //         return;
    //     }
    
    //     // Extract only names
    //     const selectedNames = selectedTimePeriods.map(item => item?.name || "");
    
    //     // Update state
    //     setSelectedTimePeriod(selectedNames.filter(name => name !== ""));
    // };

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
            setconditionOption(data.condition || []);
            setImageID(data.image_keys || []);

        // Fetch available image keys from Cloudflare R2
        const imagesResponse = await fetch('/api/images?action=get');
        if (!imagesResponse.ok) {
            throw new Error('Failed to fetch image list');
        }

        const { images } = await imagesResponse.json();

        // Construct URLs for the item's image keys and fetch actual image data
        const previewImageURLs = await Promise.all((data.image_keys || []).map(async (key) => {
            if (images.includes(key)) {
                const imageData = await fetch(`https://upload-r2-assets.somerville-museum1.workers.dev/${key}`);
                const blob = await imageData.blob();
        
                // Create a blob URL instead of a File
                const imageUrl = URL.createObjectURL(blob);
                return imageUrl;
            }
            return null;
        }));
        
        // Filter out null values and update preview state with actual File objects
        setPreview(previewImageURLs.filter(url => url !== null));
        setImageID(data.image_keys || []);
        setPrevImageID(data.image_keys || []);

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
            condition: conditionOption.length > 0 ? conditionOption : null,
            color: selectedColors.length > 0 ? selectedColors : null,
            status: "Available",
            location: null,
            date_added: isToggleEnabled ? manualDateText : placeholderDate, 
            current_borrower: null,
            borrow_history: null,
            image_keys: imageID
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

        // Upload only images that are not already in prevImageID
        const uploadImages = async () => {
            // Identify which image IDs are new
            const newImageIDs = imageID.filter(id => !prevImageID.includes(id));
            const newPreviews = preview.filter((_, idx) => !prevImageID.includes(imageID[idx]));

            // If no new images, skip upload
            if (newImageIDs.length === 0) {
                return;
            }

            try {
                const response = await fetch(`/api/images?action=upload`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fileNames: newImageIDs, fileContents: newPreviews }),
                });

                if (!response.ok) {
                    const data = await response.json();
                    console.error(data);
                    setStatusMessage("An error uploading image occurred. Please try again.");
                    setStatusType("error");
                    return;
                }

            } catch (error) {
                console.error(error);
                setStatusMessage("An error uploading image occurred. Please try again.");
                setStatusType("error");
                return;
            }
        };

        // Call the uploader unconditionally, skip if no new images
        uploadImages();

        const deleteImages = async () => {
            // Identify removed image IDs
            const deletedImageIDs = prevImageID.filter(id => !imageID.includes(id));
        
            if (deletedImageIDs.length === 0) {
                return;
            }
        
            try {
                // Delete each file individually
                for (const fileName of deletedImageIDs) {
                    const response = await fetch(`/api/images?action=delete`, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ fileName }),
                    });
        
                    if (!response.ok) {
                        const data = await response.json();
                        console.error("Failed to delete:", data);
                    }
                }
            } catch (error) {
                console.error("Error during image deletion:", error);
            }
        };
        
        // Call the delete function unconditionally, skip if no images to delete
        deleteImages();

        // Convert newItem params to JSON object
        const body = JSON.stringify(newItem);

        const updateItem = async () => {
            try {
                const response = await fetch(`../../api/itemManagement?action=updateItem`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body
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
                        onDrop={handleDrop}>
                        {preview.length === 0 ? (
                        <div className="upload-icon-and-text">
                            <img src="/icons/upload.svg" className="upload-icon" />
                            <p style={{ color: "#9B525F" }}>Upload image*</p>
                        </div>
                        ) : (
                        <div className="upload-content">
                            {preview.map((image, index) => (
                            <div key={index} className="image-preview-container">
                                <button
                                className="remove-image-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const updatedPreviews = [...preview];
                                    const updatedIDs = [...imageID];
                                    updatedPreviews.splice(index, 1);
                                    updatedIDs.splice(index, 1);
                                    setPreview(updatedPreviews);
                                    setImageID(updatedIDs);
                                }}
                                aria-label="Remove image"
                                >
                                ×
                                </button>
                                <img src={image} alt={`Preview ${index + 1}`} className="preview" />
                            </div>
                            ))}

                            {preview.length < 2 && (
                            <div className="upload-icon-and-text">
                                <img src="/icons/upload.svg" className="upload-icon" />
                                <p style={{ color: "#9B525F" }}>Upload second image</p>
                            </div>
                            )}
                        </div>
                        )}

                        <input
                        type="file"
                        id="file-input"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleFileInputChange}
                        />

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
                            value={notesText || ""}
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

                    {/* conditionOption Dropdown */}
                    <div className="conditionOption-component">
                        <div className="dropdown-component">
                            <h3 className={errors.condition ? "error-text" : ""}>Condition*<span style={{fontWeight: "400"}}> (Max of 2)</span></h3> 
                            <MultiSelect
                                value={conditionOptions.filter(cond => conditionOption.includes(cond.name))} // Sync selected values
                                options={conditionOptions}
                                onChange={(e) => handleconditionOptionSelect(e.value || [])} // Ensure `e.value` is never undefined
                                optionLabel="name" 
                                display="chip" 
                                maxSelectedLabels={2}
                                placeholder="Select condition"
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