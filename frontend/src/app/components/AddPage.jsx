"use client"; // This file is client-side

import { useState, useEffect } from 'react';
import "../globals.css";
import UploadIcon from "../../../public/icons/upload.svg";

export default function AddPage() {
    const [dragOver, setDragOver] = useState(false);
    const [preview, setPreview] = useState(null);

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
                <div className="left">
                    <div className="title">
                        Add Item
                    </div>

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

                    </div>

                </div>

                <div className="right">
                    <div className="garment-type-component">
                        <h3>Garment Type</h3>
                        
                    </div>
                </div>
            </div>    
        </div>
    );
}
