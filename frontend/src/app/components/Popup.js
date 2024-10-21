"use client"; // This file is client-side
// Filename: App.js
import React, { useState } from 'react';
import SelectDropdown from './SelectDropdown';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css'; // Ensure this is imported
import { v4 as uuidv4 } from 'uuid';

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

    const uniqueId = uuidv4(); // Generate a unique ID

    return (
        <div>
            <Popup trigger={<button className="btn btn-primary"> Click to open modal </button>} modal nested>
                {close => (
                    <div className='modal'>
                        <div className='content'>
                            <h2>Welcome to GFG!!!</h2>
                            <input
                                type="text"
                                placeholder="Enter ID"
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
                                    {/* Add more fields as needed */}
                                </div>
                            )}
                        </div>

                        <SelectDropdown />

                        <div>
                            <button onClick={() => close()} className="btn btn-secondary">Close modal</button>
                        </div>
                    </div>
                )}
            </Popup>
        </div>
    );
}