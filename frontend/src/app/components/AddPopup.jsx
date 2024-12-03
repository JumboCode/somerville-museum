"use client"; // This file is client-side

import { useState, useEffect } from 'react';
import "./AddPopup.css";

export default function AddPopup() {
    const [itemName, setItemName] = useState('');
    const [id, setId] = useState(' ');
    const [location, setLocation] = useState('');
    const [note, setnote] = useState('');
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    // Fetch tags from the API (automatically on load)
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch('/api/fetchTags');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setTags(data.tags || []);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };
        fetchTags();
    }, []);

    // Handle tag selection
    const toggleTag = (tag) => {
        setSelectedTags((prevSelectedTags) =>
            prevSelectedTags.includes(tag)
                // Remove if already selected
                ? prevSelectedTags.filter((t) => t !== tag) 
                // Add if not selected
                : [...prevSelectedTags, tag] 
        );
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    await handleAdd(id, itemName, note); 
    setItemName(''); 
    setnote('');
    setSelectedTags([]);
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
                        rows="5" // Number of visible rows
                    ></textarea>
                </label>
        
            </form>
            </div>

        <div className="column">
            <h1>Tags</h1>
                <div className="tags-container">
                    {tags.map((tag) => (
                        <button
                            key={tag}
                            className={`tag-button ${selectedTags.includes(tag) ? 'selected' : ''}`}
                            onClick={() => toggleTag(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
                <div className="cancel-container">
                    <button type="submit">Cancel</button>
                </div>

                <div className="submit-container">
                    <button type="submit">Submit</button>
                </div>

            </div>

        </div>
    );
}
