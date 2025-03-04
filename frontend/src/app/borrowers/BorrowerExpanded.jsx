 /**************************************************************
 *
 *                     BorrowerExpanded.jsx
 *
 *        Authors: Hannah Jiang & Peter Morganelli & Zack White
 *           Date: 03/05/2025
 *
 *     Summary: The sidebar popup for a selected item in the borrower page.
 * 
 **************************************************************/

"use client";

import "./BorrowerExpanded.css";
import StylishButton from "../components/StylishButton";

export default function BorrowerExpanded({ borrower, onClose }) {
  if (!borrower) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <div className="header">
            <h2>{borrower.name}</h2>
            <StylishButton
                styleType={"style7"}
                onClick={onClose}
            >
                <img src="/icons/close.svg" className="closeIcon" alt="Close" />
            </StylishButton>
        </div>
        <div className="emailcell">
            <p><strong>Email:</strong> {borrower.email}</p>
            <p><strong>Cell:</strong> {borrower.phone_number}</p>
        </div>

        <div id="currentBorrowerContainer">
            <p id="borrowerHistorytitle">Borrowing History</p> 
            <table id="borrowerHistory">
                <tbody>
                    <tr>
                        {borrower.borrow_history && Object.keys(borrower.borrow_history).length > 0
                        ? Object.keys(borrower.borrow_history).join(", ")
                        : " No Borrowing History"}
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
