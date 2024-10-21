"use client"; // This file is client-side
// Filename: App.js

import React, { useState } from 'react';
import Popup from 'reactjs-popup';

export default function PopupGfg() {
    const [inputValue, setInputValue] = useState('');
    const [itemData, setItemData] = useState(null);
    const [error, setError] = useState(null);

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
            setItemData(result);
            setError(null);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.message);
            setItemData(null);
        }
    };

    return (
        <div>
            <Popup trigger={<button> Click to open modal </button>} modal nested>
                {close => (
                    <div className='modal'>
                        <div className='content'>
                            <h2>Welcome to GFG!!!</h2>
                            <input
                                type="text"
                                placeholder="Enter ID"
                                value={inputValue}
                                onChange={handleInputChange}
                            />
                            <button onClick={handleFetchData}>Fetch Data</button>
                            {error && <p className="error">{error}</p>}
                            {itemData && (
                                <div className="item-data">
                                    <p>ID: {itemData.id}</p>
                                    <p>Name: {itemData.name}</p>
                                    {/* Add more fields as needed */}
                                </div>
                            )}
                        </div>
                        <div>
                            <button onClick={() => close()}>Close modal</button>
                        </div>
                    </div>
                )}
            </Popup>
        </div>
    );
}