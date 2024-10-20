import { useState } from "react";

export default function EditNoteButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (event) => {
    event.preventDefault();
    setIsOpen(true); // Open the modal when button is clicked
  };

  const closeModal = () => {
    setIsOpen(false); // Close the modal when clicking the close button
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
            <p>You can add or modify the note content here.</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
