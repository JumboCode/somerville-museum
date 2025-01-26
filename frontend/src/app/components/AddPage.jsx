"use client"; // This file is client-side

import { useState, useEffect } from 'react';
import "../globals.css";

export default function AddPage() {
    const [dragOver, setDragOver] = useState(false);
    const [preview, setPreview] = useState(null);
    const [itemName, setItemName] = useState('');
    const [id, setId] = useState('');
    const [date, setDate] = useState('');
    const [price, setPrice] = useState('');
    const [garmentTag, setGarmentTag] = useState('');
    const [timeTag, setTimeTag] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState([]);
    const [size, setSize] = useState([]);
    const [Season, setSeason] = useState([]);
    const [condition, setCondition] = useState([]);
    const [color, setColor] = useState([]);

    // // Fetch garment tags from the server
    // useEffect(() => {
    //     const fetchGarmentTags = async () => {
    //         try {
    //             const response = await fetch('/api/garmentTags');
    //             if (!response.ok) throw new Error('Network response was not ok');
    //             const data = await response.json();

    //             // Convert array of objects to an array of strings
    //             const tags = data.map((tag) => tag.name);

    //         } catch (error) {
    //             console.error('Error fetching tags:', error);
    //         }
    //     };

    //     fetchGarmentTags();
    // }, []);

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
                        <p>asjdbfjasbdfjhabshdj</p>

                    </div>

                </div>
                
                {/* Middle Vertical Divider */}
                <div class="divider"></div>

                {/* Right Column */}
                <div className="right">

                    {/* Garment and Time Section */}
                    <div className="garment-and-time">
                        
                        {/* Garment Title and Dropdown */}
                        <div className="garment-type-component">
                            <h3>Garment Type*</h3>

                            <select id="singleSelect" onChange={(e) => handleGarmentSelection(e.target.value)}>
                                {/* {tags.map((tag) => (
                                    <option key={tag} value={tag}>
                                        {tag}
                                    </option>
                                ))} */}
                            </select>
                        </div>

                        {/* Time Period Title and Dropdown */}
                        <div className="time-period-component">
                            <h3>Time Period*<span style={{fontWeight: "400"}}>(Max of 2)</span></h3>
                        </div>
                    </div>
                        
                    <p>asjdbfjasbdfjhabshdj</p>

                </div>
            </div>    
        </div>
    );
}
