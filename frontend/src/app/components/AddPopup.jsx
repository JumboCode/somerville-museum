"use client"; // This file is client-side

import { useState, useEffect } from 'react';
import "./AddPopup.css";

export default function AddPopup() {
    const [itemName, setItemName] = useState('');
    const [id, setId] = useState(' ');
    const [location, setLocation] = useState('');
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
        await handleAdd(id, itemName, note); 
        setItemName(''); 
        setNote('');
        // setSelectedTags([]);
    };

  
    const handleAdd = async (id, name, note) => {
        const body = JSON.stringify({
            name: name,
            id: id,
            note: note
        });
        console.log('Body:', body); // Should log the body with hardcoded values

        const response = await fetch(`../../api/addItem`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json' // Specify the content type
            },
            body: JSON.stringify({ id: id, name: name, note: note}) // Send the id as a JSON object
        });
    };

    return (                
    <form onSubmit={handleSubmit}>
        <div className="row">
            <div className="column">
                <h1>Add Item</h1>
                <br></br>

                <img src="/images/DisplayImage.svg" className="styled-image" />
                <br></br>

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
                        Notes <br></br>
                        <textarea
                            name="note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows="5" // Num. visible rows
                        ></textarea>
                    </label>
                    {/* <button type="submit">Submit</button> */}
            </div>

            <div className="column">
                <h2>Tags</h2>
                <div className="dropdowns-container">
                    {/* First Row: Century and Size */}
                    <div className="inline-row">
                        <div className="dropdown">
                            <h3>Century</h3>
                            <select>
                                <option>???</option>
                            </select>
                        </div>
                        <div className="dropdown">
                            <h3>Size</h3>
                            <select>
                                <option>???</option>
                            </select>
                        </div>
                    </div>
                    <div className="dropdown">
                        <h3>Clothing Type</h3>
                        <select>
                            <option>???</option>
                        </select>
                    </div>
                    <div className="buttons-container">
                    <div className="category-buttons">
                        <h3>Gender</h3>
                        <div className="button-group">
                        <button className="category-button" id="male">Male</button>
                        <button className="category-button" id="female">Female</button>
                        <button className="category-button" id="unisex">Unisex</button>
                        </div>
                    </div>

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
                        <div
                        className="color-circle"
                        id="white"
                        style={{ backgroundColor: "white", border: "1px solid #ccc" }}
                        ></div>
                        <div className="color-circle" id="gray" style={{ backgroundColor: "gray" }}></div>
                        <div className="color-circle" id="black" style={{ backgroundColor: "black" }}></div>
                    </div>
                </div>
        <br></br>
                </div>
                <div className="inline-row">
                    <button type="">Cancel</button>
                    <button type="submit">Submit</button>
                </div>
            </div>
        </div>
    </form>
    );
}