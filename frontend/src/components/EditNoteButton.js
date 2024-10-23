"use client";

import { useState } from "react";

export default function EditNoteButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [itemInfo, setItemInfo] = useState(null); // State to hold item info
  const [error, setError] = useState(null); // State for error messages

  const handleClick = (event) => {
    event.preventDefault();
    setIsOpen(true); // Open the modal when button is clicked
  };

  const closeModal = () => {
    setIsOpen(false); // Close the modal when clicking the close button
    setItemInfo(null); // Clear item info when closing
    setError(null); // Clear error when closing
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const itemId = Number(inputValue); // Convert input value to a number
    try {
      const response = await fetch(`http://localhost:3001/items/${inputValue}`);
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
  };

  return (
    <>
      <form className="user-input" onSubmit={handleSubmit}>
        <input
          className="submit-btn"
          type="submit"
          value="Edit Note"
          onClick={handleClick}
        />
      </form>

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit your note</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="itemId">Enter Item ID:</label>
              <input
                type="text"
                id="itemId"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                required
              />
              <button type="submit">Submit</button>
              <button type="button" onClick={closeModal}>Close</button>
            </form>

            {itemInfo && (
              <div className="item-info">
                <h3>Item Information:</h3>
                <p><strong>ID:</strong> {itemInfo.id}</p>
                <p><strong>Name:</strong> {itemInfo.name}</p>
                <p><strong>Tags:</strong> {itemInfo.tags.join(', ')}</p>
                <p><strong>Note:</strong> {itemInfo.note}</p>
              </div>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error */}
          </div>
        </div>
      )}
    </>
  );
}
