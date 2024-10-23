"use client";

import { useState } from "react";

export default function EditNoteButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState(""); // State to store the note input

  const handleClick = (event) => {
    event.preventDefault();
    setIsOpen(true); // Open the modal when button is clicked
  };

  const closeModal = () => {
    setIsOpen(false); // Close the modal when clicking the close button
  };

  const handleInputChange = (event) => {
    setNote(event.target.value); // Update the note as the user types
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submitted note:", note); // Log the note when submitted
    setIsOpen(false); // Close modal after submission
    // You can add further logic here to send the note to the backend or handle it further
  };

  return (
    <>
      <form className="user-input">
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
              <textarea
                value={note}
                onChange={handleInputChange}
                placeholder="Type your note here..."
                required
              />
              <br />
              <button type="submit">Submit Note</button>
              <button type="button" onClick={closeModal}>Close</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
