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
    const [note, setNote] = useState('');
    const [garmentTag, setGarmentTag] = useState('');
    const [timeTag, setTimeTag] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState([]);
    const [size, setSize] = useState([]);
    const [Season, setSeason] = useState([]);
    const [condition, setCondition] = useState([]);
    const [color, setColor] = useState([]);

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
                <div className="divider"></div>

                {/* Right Column */}
                <div className="right">

                    {/* Garment and Time Section */}
                    <div className="garment-and-time">
                        
                        {/* Garment Title and Dropdown */}
                        <div className="garment-type-component">
                            <h3>Garment Type*</h3>
                            <select id="singleSelect" onChange={(e) => handleGarmentSelection(e.target.value)}>
                                <option value="Gowns/dresses">Gowns/dresses</option>
                                <option value="Outerwear">Outerwear</option>
                                <option value="Accessories">Accessories</option>
                                <option value="Bottoms">Bottoms</option>
                                <option value="Shoes">Shoes</option>
                                <option value="Socks/hose">Socks/hose</option>
                                <option value="Tops">Tops</option>
                                <option value="Vests">Vests</option>
                            </select>
                        </div>

                        {/* Time Period Title and Dropdown */}
                        <div className="time-period-component">
                            <h3>Time Period*<span style={{fontWeight: "400"}}> (Max of 2)</span></h3>
                            <select id="multiSelect" onChange={(e) => handleTimePeriodSelection(e.target.value)}>
                                <option value="Post-1910s">Post-1910s</option>
                                <option value="Pre-1700s">Pre-1700s</option>
                                <option value="1750s-1800s">1750s - 1800s</option>
                                <option value="1800s-1840s">1800s - 1840s</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>    
        </div>
    );
}
