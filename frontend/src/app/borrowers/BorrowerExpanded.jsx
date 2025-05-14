"use client";

import React, { useState, useEffect } from 'react';
import "./BorrowerExpanded.css";
import CloseButton from "../assets/CloseButton";
import ArrowLeft from "../assets/ArrowLeft";
import ArrowRight from "../assets/ArrowRight";
import StylishButton from "../components/StylishButton";

export default function BorrowerExpanded({ borrower, onClose, onPrev, onNext }) {
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBorrowHistory = async () => {
      if (!borrower?.id) return;
      
      setLoading(true);
      try {
        const response = await fetch(`/api/borrowManagement?action=borrowerHistory&id=${borrower.id}`);
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft" && onPrev) {
        onPrev();
      } else if (e.key === "ArrowRight" && onNext) {
        onNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext]);

  if (!borrower) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-anim-wrapper"> 
        <div className="popup" onClick={(e) => e.stopPropagation()}>
          <div className="TitleTop" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h2 style={{ margin: 0 }}>{borrower.name}</h2>
            <div className="buttonsB">
              {/* Left arrow button */}
              <StylishButton
                  styleType={"style7"}
                  onClick={onPrev}
              >
                <img src="/icons/arrow-left.svg" className="arrowIcon" alt="Previous" />
              </StylishButton>
              {/* Right arrow button */}
              <StylishButton
                  styleType={"style7"}
                  onClick={onNext}
              >
                <img src="/icons/arrow-right.svg" className="arrowIcon" alt="Next" />
              </StylishButton>
              <div className="exit">
                <StylishButton
                    styleType={"style7"}
                    onClick={onClose}
                >
                  <img src="/icons/close.svg" className="closeIcon" alt="Close" />
                </StylishButton>
              </div>
            </div>
          </div> 
          <p style={{ marginTop: ".5rem" }}><strong>Email:</strong> {borrower.email}</p>
          <p style={{ marginTop: ".5rem" }}><strong>Cell:</strong> {borrower.phone_number}</p>
          
          <div style={{ marginTop: "1rem" }}>
            <strong>Borrow History:</strong>
            {loading ? (
              <p>Loading history...</p>
            ) : borrowHistory.length > 0 ? (
              <table id="borrowerHistory">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Borrowed</th>
                    <th>Due</th>
                    <th>Returned</th>
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
        </div>
      </div>
    </div>
  );
}