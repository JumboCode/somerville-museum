"use client";
import "./BorrowerExpanded.css";

export default function BorrowerExpanded({ borrower, onClose }) {
  if (!borrower) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>{borrower.name}</h2>
        <p><strong>Email:</strong> {borrower.email}</p>
        <p><strong>Cell:</strong> {borrower.phone_number}</p>
        <p>
          <strong>Borrow History:</strong>{" "}
          {borrower.borrow_history && Object.keys(borrower.borrow_history).length > 0
            ? Object.keys(borrower.borrow_history).join(", ")
            : "No Borrowing History"}
        </p>
      </div>
    </div>
  );
}
