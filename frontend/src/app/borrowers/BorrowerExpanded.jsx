"use client";
import React, { useState, useEffect } from "react";
import "./BorrowerExpanded.css";
import CloseButton from "../assets/CloseButton";
import ArrowLeft from "../assets/ArrowLeft";
import ArrowRight from "../assets/ArrowRight";

export default function BorrowerExpanded({ borrower, onClose, onPrev, onNext }) {
  const [isClosing, setIsClosing] = useState(false);
  if (!borrower) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const borrowHistoryEntries = borrower.borrow_history
    ? Object.entries(borrower.borrow_history)
    : [];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="popup-overlay" onClick={handleClose}>
      <div className={`popup-anim-wrapper ${isClosing ? 'slide-out' : 'slide-in'}`}>
        <div className="popup" onClick={(e) => e.stopPropagation()}>
          <div className="name-and-button">
            <h2>{borrower.name}</h2>
            <CloseButton className="close-btn" onClick={onClose} />
          </div>

          <div className="popup-scrollable-body">
            <p><strong>Email:</strong> {borrower.email}</p>
            <br />
            <p><strong>Cell:</strong> {borrower.phone_number}</p>

            <div className="borrow-history-container">
              <strong>Borrow History:</strong>
              {borrowHistoryEntries.length > 0 ? (
                <table id="borrowerHistory">
                  <tbody>
                    {borrowHistoryEntries.map(([key, record]) => {
                      const dateRange = `${record.dateBorrowed} - ${record.dateReturned || "Not Returned"}`;
                      return (
                        <React.Fragment key={key}>
                          <tr>
                            <td>{dateRange}</td>
                            <td>{record.itemId}</td>
                            <td>{record.borrowerId}</td>
                          </tr>
                          <tr className="history-divider">
                            <td colSpan="3" style={{ padding: "10px", backgroundColor: "#f9f9f9", fontWeight: "normal" }}>
                              Note: {record.note}
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p>No Borrowing History</p>
              )}
            </div>
          </div>

          <div className="navigation-arrows">
            <ArrowLeft
              className={`nav-arrow left-arrow ${!onPrev ? "disabled" : ""}`}
              onClick={onPrev}
            />
            <ArrowRight
              className={`nav-arrow right-arrow ${!onNext ? "disabled" : ""}`}
              onClick={onNext}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
