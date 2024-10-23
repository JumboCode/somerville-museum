"use client"; // This tells Next.js to treat this file as a Client Component

import { useState } from "react";

export default function EditNoteButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [itemInfo, setItemInfo] = useState(null);
    const [error, setError] = useState(null);

    const handleClick = (event) => {
        event.preventDefault();
        setIsOpen(true); // Open the modal when button is clicked
    };

    const closeModal = () => {
        setIsOpen(false); // Close the modal when clicking the close button
        setItemInfo(null); // Reset item info when closing
        setError(null); // Reset error message when closing
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/query', {
                method: 'POST', // Specify POST method
                headers: {
                    'Content-Type': 'application/json', // Specify JSON content type
                },
                body: JSON.stringify({ id: Number(inputValue) }), // Send the ID as JSON
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();
            setItemInfo(data); // Set the fetched item info
            setError(null); // Clear any previous error
        } catch (error) {
            console.error('Fetch error:', error);
            setError('Item not found.'); // Set error message if fetch fails
        }

        setInputValue(""); // Clear input
    };

    return (
        <>
            <button onClick={handleClick}>Edit Note</button>

            {isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Edit your note</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Enter Item ID"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                required
                            />
                            <button type="submit">Submit</button>
                            <button type="button" onClick={closeModal}>Close</button>
                        </form>
                        {itemInfo && (
                            <div>
                                <h3>Item Information:</h3>
                                <p><strong>ID:</strong> {itemInfo.id}</p>
                                <p><strong>Name:</strong> {itemInfo.name}</p>
                                <p><strong>Tags:</strong> {itemInfo.tags.join(', ')}</p>
                                <p><strong>Note:</strong> {itemInfo.note}</p>
                            </div>
                        )}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </div>
                </div>
            )}
        </>
    );
}