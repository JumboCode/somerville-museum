"use client";
import React from "react";
import { useState } from 'react';
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
      onClose(); // parent will unmount this component
    }, 300); // match animation time
  };

  const borrowHistoryEntries = borrower.borrow_history
    ? Object.entries(borrower.borrow_history)
    : [];

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
          {borrowHistoryEntries.length > 0 ? (
            <table id="borrowerHistory">
              <tbody>
                {borrowHistoryEntries.map(([key, record]) => {
                  const dateRange = `${record.dateBorrowed} - ${record.dateReturned ? record.dateReturned : "Not Returned"}`;
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

        <div className="navigation-arrows">
            <ArrowLeft className="nav-arrow left-arrow" onClick={onPrev} />
            <ArrowRight className="nav-arrow right-arrow" onClick={onNext}/>
        </div>
      </div>

      </div>
    </div>
  );
}
