"use client";
import React, { useState, useEffect } from 'react';
import "./BorrowerExpanded.css";
import CloseButton from "../assets/CloseButton";
import ArrowLeft from "../assets/ArrowLeft";
import ArrowRight from "../assets/ArrowRight";

export default function BorrowerExpanded({ borrower, onClose, onPrev, onNext }) {
  const [isClosing, setIsClosing] = useState(false);
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBorrowHistory = async () => {
      if (!borrower?.id) return;
      
      setLoading(true);
      try {
        const response = await fetch(`../../../../api/borrowManagement?action=borrowerHistory&id=${borrower.id}`);
        const data = await response.json();
        setBorrowHistory(data);
      } catch (error) {
        console.error("Error fetching borrow history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowHistory();
  }, [borrower]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not Returned";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Add Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!borrower) return null;

  return (
    <div className="popup-overlay" onClick={handleClose}>
      <div className={`popup-anim-wrapper ${isClosing ? 'slide-out' : 'slide-in'}`}> 
        <div className="popup" onClick={(e) => e.stopPropagation()}>
          <CloseButton className="close-btn" onClick={onClose} /> 

          <br />
          <h2>{borrower.name}</h2>
          <br />
          <p><strong>Email:</strong> {borrower.email}</p>
          <br />
          <p><strong>Cell:</strong> {borrower.phone_number}</p>
          
          <div style={{ marginTop: "1rem" }}>
            <strong>Borrow History:</strong>
            {loading ? (
              <p>Loading history...</p>
            ) : borrowHistory.length > 0 ? (
              <table id="borrowerHistory">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Borrow Date</th>
                    <th>Due Date</th>
                    <th>Return Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {borrowHistory.map((record) => (
                    <React.Fragment key={record.id}>
                      <tr>
                        <td>{record.item_name || `Item ${record.item_id}`}</td>
                        <td>{formatDate(record.date_borrowed)}</td>
                        <td>{formatDate(record.return_date)}</td>
                        <td>{formatDate(record.date_returned)}</td>
                        <td>{record.date_returned ? "Returned" : "Borrowed"}</td>
                      </tr>
                      {record.notes && (
                        <tr className="history-divider">
                          <td colSpan="5" style={{ padding: "10px", backgroundColor: "#f9f9f9", fontWeight: "normal" }}>
                            <strong>Note:</strong> {record.notes}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No Borrowing History</p>
            )}
          </div>

          <div className="navigation-arrows">
            <ArrowLeft className="nav-arrow left-arrow" onClick={onPrev} />
            <ArrowRight className="nav-arrow right-arrow" onClick={onNext}/>
          </div>
        </div>
      </div>
    </div>
  );
}