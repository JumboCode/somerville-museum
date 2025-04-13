"use client";
import React, { useState, useEffect } from "react";
import "../globals.css";
import "./BorrowerTable.css";
import StylishButton from "../components/StylishButton";
import BorrowerExpanded from "./BorrowerExpanded";

export default function BorrowerTable({ searchResults, onSelectBorrower }) {
  const borrowers = searchResults || [];
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedBorrowerIndex, setSelectedBorrowerIndex] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const totalPages = Math.ceil(borrowers.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [borrowers, itemsPerPage, totalPages]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBorrowers = borrowers.slice(startIndex, startIndex + itemsPerPage);

  const handleItemsPerPageChange = (event) => {
    const newItemsPerPage = Number(event.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSelectBorrower = (borrower) => {
    const index = borrowers.findIndex(b => b.email === borrower.email); // Use unique field
    if (index !== -1) {
      setSelectedBorrowerIndex(index);
      setShowPopup(true);
    }
  };

  const buttons = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="tableContainer">
      <div className="tableContent">
        <table id="borrowerInfo">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Borrow History</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentBorrowers.length > 0 ? (
              currentBorrowers.map((borrower, index) => {
                const hasHistory =
                  borrower.borrow_history &&
                  Object.keys(borrower.borrow_history).length > 0;
                return (
                  <tr key={index} onDoubleClick={() => handleSelectBorrower(borrower)}>
                    <td>{borrower.name}</td>
                    <td>{borrower.email}</td>
                    <td>{borrower.phone_number}</td>
                    <td>
                      {hasHistory
                        ? Object.keys(borrower.borrow_history).join(", ")
                        : "No Borrowing History"}
                    </td>
                    <td onClick={() => handleSelectBorrower(borrower)}>
                      <span className="three-dots">...</span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No borrowers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex-spacer" />

      <div className="pagination-controls">
        <div className="num-items">
          <p className="view">View </p>
          <select
            className="select-num"
            id="select-num"
            onChange={handleItemsPerPageChange}
            value={itemsPerPage}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <div className="page-selection">
          <StylishButton
            className="leftBtn"
            label="&lt;"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            styleType="style4"
          />
          {buttons.map((number) => (
            <StylishButton
              className="pageNum"
              label={number}
              key={number}
              onClick={() => setCurrentPage(number)}
              styleType={currentPage === number ? "style5" : "style4"}
            />
          ))}
          <StylishButton
            className="rightBtn"
            label="&gt;"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            styleType="style4"
          />
        </div>
      </div>

      {showPopup && selectedBorrowerIndex !== null && (
        <BorrowerExpanded
          borrower={borrowers[selectedBorrowerIndex]}
          onClose={() => setShowPopup(false)}
          onPrev={
            selectedBorrowerIndex > 0
              ? () => setSelectedBorrowerIndex((prev) => prev - 1)
              : null
          }
          onNext={
            selectedBorrowerIndex < borrowers.length - 1
              ? () => setSelectedBorrowerIndex((prev) => prev + 1)
              : null
          }
        />
      )}
    </div>
  );
}
