"use client"; // This file is client-side
// Filename: App.js
import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import SelectDropdown from './SelectDropdown'; // Ensure this is the correct path
import { v4 as uuidv4 } from 'uuid';

export default function PopupGfg() {
    const [inputValue, setInputValue] = useState('');
    const [itemData, setItemData] = useState(null);
    const [error, setError] = useState(null);
    const [keywords, setKeywords] = useState([]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleFetchData = async () => {
        try {
            const response = await fetch(`http://localhost:5432/item/${inputValue}`);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const result = await response.json();
    
            // Ensure result.tags is a string before calling split
            const tags = typeof result.tags === 'string' ? result.tags.split(',') : [];
    
            setItemData(result);
            setKeywords(tags);
            setError(null);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.message);
            setItemData(null);
        }
    };
    
    const handleKeywordsChange = (newKeywords) => {
        setKeywords(newKeywords);
    };
    
    const handleUpdateTags = async () => {
        if (!itemData) return;
    
        try {
            const response = await fetch(`http://localhost:5432/item/${itemData.id}/tags`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tags: keywords }),
            });
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const result = await response.json();
            setItemData(result);
            setError(null);
        } catch (error) {
            console.error('Error updating tags:', error);
            setError(error.message);
        }
    };

    const uniqueId = uuidv4(); // Generate a unique ID

    return (
        <div>
            <Popup trigger={<button className="btn btn-primary"> Add/delete tags </button>} modal nested>
                {close => (
                    <div className='modal'>
                        <div className='content'>
                            <h2>Search</h2>
                            <br></br>
                            <input
                                type="text"
                                placeholder="Enter Data ID#"
                                value={inputValue}
                                onChange={handleInputChange}
                                className="form-control"
                                aria-describedby={`popup-${uniqueId}`}
                            />
                            <button onClick={handleFetchData} className="btn btn-success">Fetch Data</button>
                            {error && <p className="error">{error}</p>}
                            {itemData && (
                                <div className="item-data">
                                    <p>ID: {itemData.id}</p>
                                    <p>Name: {itemData.name}</p>
                                    <p>Tags: {itemData.tags.join(', ')}</p>
                                    <SelectDropdown selectedTags={keywords} onKeywordsChange={handleKeywordsChange} />
                                    <button 
                                        onClick={handleUpdateTags} 
                                        className="btn btn-success"
                                        style={{ backgroundColor: '#FF8EE7', color: '#000000', borderRadius: '5px', padding: '5px' }}
                                    >
                                        Update Tags
                                    </button>
                                </div>
                            )}
                        </div>
                        <div>
                            <button onClick={() => close()} className="btn btn-secondary">Close Popup</button>
                        </div>
                    </div>
                )}
            </Popup>
        </div>
    );
}