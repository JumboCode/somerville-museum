"use client";

import React, { useState } from 'react';
import ExpandedEntry from './ExpandedEntry';

export default function SelectItemButton() {
    const [showPopup, setShowPopup] = useState(false);
    const [itemData, setItemData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleClick = async () => {
        const id = prompt("Please enter item id", "");

        if (!id) {
            alert("User cancelled the prompt.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('../../api/selectId', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setItemData(data);
            setShowPopup(true);
        } catch (error) {
            console.error('Error fetching item:', error);
            setError('Failed to fetch item. Please try again later.');
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative">
            <button 
                onClick={handleClick}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
                {isLoading ? 'Loading...' : 'Select Item'}
            </button>
            
            {error && (
                <div className="text-red-500 mt-2">{error}</div>
            )}
            
            {showPopup && (
                <ExpandedEntry 
                    itemData={itemData} 
                    onClose={() => setShowPopup(false)} 
                />
            )}
        </div>
    );
}