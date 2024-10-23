"use client"; // Ensure this component runs on the client side

import { useState } from "react";

export default function EditNoteButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(""); // For item ID
    const [noteValue, setNoteValue] = useState(""); // For the new note
    const [itemInfo, setItemInfo] = useState(null);
    const [error, setError] = useState(null);

    const handleTogglePopup = () => {
        setIsOpen(!isOpen);
        setInputValue("");
        setNoteValue("");
        setItemInfo(null);
        setError(null);
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleNoteChange = (event) => {
        setNoteValue(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const response = await fetch("http://localhost:3001/query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: parseInt(inputValue) }),
            });

            if (!response.ok) {
                throw new Error('Item not found.');
            }

            const data = await response.json();
            setItemInfo(data);
            setNoteValue(data.note); // Pre-fill the note input with the current note
            setError(null);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleUpdateNote = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:3001/update-note", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: itemInfo.id, note: noteValue }), // Update the note
            });

            if (!response.ok) {
                throw new Error('Failed to update note');
            }

            alert('Note updated successfully!'); // Notify the user of success
            handleTogglePopup(); // Close the popup after successful update
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <>
            <button onClick={handleTogglePopup}>Edit Note</button>
            {isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Edit your note</h2>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="noteInput">Enter item ID:</label>
                            <input
                                type="text"
                                id="noteInput"
                                value={inputValue}
                                onChange={handleInputChange}
                                required
                            />
                            <button type="submit">Submit</button>
                            <button type="button" onClick={handleTogglePopup}>Close</button>
                        </form>
                        {itemInfo && (
                            <div className="item-info">
                                <h3>Item Information</h3>
                                <p><strong>ID:</strong> {itemInfo.id}</p>
                                <p><strong>Name:</strong> {itemInfo.name}</p>
                                <p><strong>Tags:</strong> {itemInfo.tags.join(', ')}</p>
                                <p><strong>Note:</strong> 
                                    <input
                                        type="text"
                                        value={noteValue}
                                        onChange={handleNoteChange}
                                    />
                                </p>
                                <button onClick={handleUpdateNote}>Update Note</button>
                            </div>
                        )}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </div>
                </div>
            )}
        </>
    );
}