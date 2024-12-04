"use client"; // This file is client-side

import { useState, useEffect } from 'react';
import "./AddPopup.css";

export default function AddPopup() {
    const [itemName, setItemName] = useState('');
    const [id, setId] = useState(' ');
    const [location, setLocation] = useState('');
    const [note, setNote] = useState('');
    const [century, setCentury] = useState('');
    const [size, setSize] = useState('');
    const [clothingType, setClothingType] = useState('');

const handleSubmit = async (e) => {
    e.preventDefault();
    await handleAdd(id, itemName, note); 
    setItemName(''); 
    setNote('');
    setSelectedTags([]);
  };

const handleAdd = async (id, name, note) => {
    const body = JSON.stringify({
        name: name,
        id: id,
        note: note
    });
    console.log('Body:', body); // Should log the body with hardcoded values

    const response = await fetch(`../../api/addItem`, { 
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json' // Specify the content type
        },
        body: JSON.stringify({ id: id, name: name, note: note}) // Send the id as a JSON object
    });

};

    return (
        <div className="row">
            <div className="column">
                <h1>Add Item</h1>
                <br></br>

                <img src="/images/DisplayImage.svg" alt="Descriptive text" className="styled-image" />
                <br></br>

                <form onSubmit={handleSubmit}>
                    <label>
                        Item Name:
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
                        Notes <br></br>
                        <textarea
                            name="note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows="5" // Num. visible rows
                        ></textarea>
                    </label>
                    <button type="submit">Submit</button>
                </form>
            </div>

            <div className="column">
                <h1>Tags</h1>
                <div className="dropdowns-container">
                    {/* First Row: Century and Size */}
                    <div class="inline-row">
                        <div class="dropdown">
                        <h3>Century</h3>
                        <select>
                            <option>???</option>
                        </select>
                        </div>
                        <div class="dropdown">
                        <h3>Size</h3>
                        <select>
                            <option>???</option>
                        </select>
                        </div>
                    </div>
                    <div class="dropdown">
                        <h3>Clothing Type</h3>
                        <select>
                        <option>???</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
