"use client";
import "./BorrowerExpanded.css";

export default function BorrowerExpanded({ borrower, onClose }) {
  if (!borrower) return null;

  //pre format the borrow history since borrow_history is a JSON object
  //hannah make it look pretty :3
  const formattedBorrowHistory = borrower.borrow_history 
    ? JSON.stringify(borrower.borrow_history, null, 2)
    : "No Borrowing History";

  const formattedBorrowerId = borrower.id_borrowers_borrow_id 
    ? JSON.stringify(borrower.id_borrowers_borrow_id, null, 2)
    : "No Borrower Borrowers ID";

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>{borrower.name}</h2>
        <p><strong>Email:</strong> {borrower.email}</p>
        <p><strong>Cell:</strong> {borrower.phone_number}</p>
        <div>
          <strong>Borrow History:</strong>
          <pre>{formattedBorrowHistory}</pre>
        </div>
      </div>
    </div>
  );
}
