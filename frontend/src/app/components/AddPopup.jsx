"use client"; // This file is client-side

import { useState, useEffect } from 'react';
import "./AddPopup.css";

export default function AddPopup() {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [itemName, setItemName] = useState('');
    const [id, setId] = useState('');
    const [location, setLocation] = useState('');
    const [centuryTag, setCenturyTag] = useState('');
    const [sizeTag, setSizeTag] = useState('');
    const [clothingTag, setClothingTag] = useState('');
    const [note, setNote] = useState('');
    const [tags, setTags] = useState([]);
    const [error, setError] = useState(null);

    // Fetch the tags from the API (automatically on load)
    useEffect(() => {
        const fetchTags = async () => {
            try {
                // Fetch all tags from the API
                const response = await fetch('/api/fetchTags');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();

                // Convert the array of objects to an array of strings
                const tagsArray = data.map(item => item.tag);

                // Save the tags in state
                setTags(tagsArray);
            } catch (error) {
                console.error('Error fetching tags:', error);
                setError(error.message);
            }
        };

        // Call the fetchTags function
        fetchTags();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Call the handleAdd function
        await handleAdd(id, itemName, note, centuryTag, sizeTag, clothingTag); 
        
        // Reset fields after submission
        setItemName(''); 
        setId('');
        setNote('');
        setCenturyTag([]);
        setSizeTag([]);
        setClothingTag([]);
    };

    const handleCancel = () => {
        // Reset all fields when cancel button is clicked
        setItemName('');
        setId('');
        setLocation('');
        setCenturyTag('');
        setSizeTag('');
        setClothingTag('');
        setNote('');
        setIsPopupVisible(false);
    };

    // Functions to handle dropdown selections
    const handleCenturySelect = (value) => setCenturyTag(value);
    const handleSizeSelect = (value) => setSizeTag(value);
    const handleClothingSelect = (value) => setClothingTag(value);
  
    // Function to send a POST request to the addItem API
    const handleAdd = async (id, name, note) => {
        // Create a JSON object with the fields from the popup
        const body = JSON.stringify({
            name: name,
            id: Number(id),
            note: note,
            tag1: centuryTag,
            tag2: sizeTag,
            tag3: clothingTag
        });

        // Send a POST request to the addItem API
        const response = await fetch(`../../api/addItem`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            // Send in all of the fields from the popup
            body: JSON.stringify({ id: id, name: name, note: note, tag1: centuryTag, tag2 : sizeTag, tag3 : clothingTag}) // Send the id as a JSON object
        });

        setIsPopupVisible(false);
    };

    return (
        <>
            <button onClick={() => setIsPopupVisible(true)}>
                +Item
            </button>
    
            {isPopupVisible && (
                <div className="popup-overlay">
                    <form onSubmit={handleSubmit} className="popup-form">
                        <div className="row">
                            {/* Left column */}
                            <div className="column">
                                <h1>Add Item</h1>
    
                                {/* Drag-and-drop placeholder */}
                                <img src="/images/DisplayImage.svg" className="styled-image" />
                                <br></br>
    
                                {/* Name field */}
                                <label>
                                    Item Name*
                                    <input
                                        name="itemName"
                                        value={itemName}
                                        onChange={(e) => setItemName(e.target.value)}
                                    />
                                </label>
    
                                {/* Container for ID and Location */}
                                <div className="inline-row">
                                    <label>
                                        ID
                                        <input
                                            name="id"
                                            value={id}
                                            onChange={(e) => setId(e.target.value)}
                                        />
                                    </label>
                                    <label>
                                        Location*
                                        <input
                                            name="location"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                        />
                                    </label>
                                </div>
    
                                {/* Notes large text input box */}
                                <label>
                                    Notes <br />
                                    <textarea
                                        name="note"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        rows="5"
                                    ></textarea>
                                </label>
                            </div>
    
                            {/* Right column */}
                            <div className="column">
                                <h2>Tags</h2>
                                <div className="dropdowns-container">
    
                                    {/* Century and size dropdowns */}
                                    <div className="inline-row">
                                        <div className="dropdown">
                                            <h3>Century</h3>
                                            <select id="singleSelect" onChange={(e) => handleCenturySelect(e.target.value)}>
                                                {tags.map((tag) => (
                                                    <option key={tag} value={tag}>
                                                        {tag}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="dropdown">
                                            <h3>Size</h3>
                                            <select id="singleSelect" onChange={(e) => handleSizeSelect(e.target.value)}>
                                                {tags.map((tag) => (
                                                    <option key={tag} value={tag}>
                                                        {tag}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
    
                                    {/* Clothing type dropdown */}
                                    <div className="dropdown">
                                        <h3>Clothing Type</h3>
                                        <select id="singleSelect" onChange={(e) => handleClothingSelect(e.target.value)}>
                                            {tags.map((tag) => (
                                                <option key={tag} value={tag}>
                                                    {tag}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
    
                                    {/* Gender buttons */}
                                    <div className="buttons-container">
                                        <div className="category-buttons">
                                            <h3>Gender</h3>
                                            <div className="button-group">
                                                <button className="category-button" id="male">Male</button>
                                                <button className="category-button" id="female">Female</button>
                                                <button className="category-button" id="unisex">Unisex</button>
                                            </div>
                                        </div>
    
                                        {/* Season buttons */}
                                        <div className="category-buttons">
                                            <h3>Season</h3>
                                            <div className="button-group">
                                                <button className="category-button" id="fall">Fall</button>
                                                <button className="category-button" id="winter">Winter</button>
                                                <button className="category-button" id="spring">Spring</button>
                                                <button className="category-button" id="summer">Summer</button>
                                            </div>
                                        </div>
                                    </div>
    
                                    {/* Color selector options */}
                                    <div className="color-selector">
                                        <h3>Color</h3>
                                        <div className="color-options">
                                            <div className="color-circle" id="red" style={{ backgroundColor: "red" }}></div>
                                            <div className="color-circle" id="orange" style={{ backgroundColor: "orange" }}></div>
                                            <div className="color-circle" id="yellow" style={{ backgroundColor: "yellow" }}></div>
                                            <div className="color-circle" id="green" style={{ backgroundColor: "green" }}></div>
                                            <div className="color-circle" id="blue" style={{ backgroundColor: "blue" }}></div>
                                            <div className="color-circle" id="purple" style={{ backgroundColor: "purple" }}></div>
                                            <div className="color-circle" id="pink" style={{ backgroundColor: "pink" }}></div>
                                            <div className="color-circle" id="brown" style={{ backgroundColor: "brown" }}></div>
                                            <div className="color-circle" id="white" style={{ backgroundColor: "white", border: "1px solid #ccc" }}></div>
                                            <div className="color-circle" id="gray" style={{ backgroundColor: "gray" }}></div>
                                            <div className="color-circle" id="black" style={{ backgroundColor: "black" }}></div>
                                        </div>
                                    </div>
                                </div>
    
                                {/* Cancel and submit buttons */}
                                <div className="button-container">
                                    <button type="button" onClick={handleCancel}>Cancel</button>
                                    <button type="submit">Submit</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
     
}