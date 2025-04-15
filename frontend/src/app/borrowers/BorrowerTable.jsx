"use client";
import React, { useState, useEffect } from "react";
import "../globals.css";
import "./BorrowerTable.css";
import StylishButton from "../components/StylishButton";

export default function BorrowerTable({ searchResults, onSelectBorrower }) {
  const [borrowersWithHistory, setBorrowersWithHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchBorrowHistory = async () => {
      if (!searchResults || searchResults.length === 0) return;
      
      setLoading(true);
      try {
        const borrowers = await Promise.all(
          searchResults.map(async (borrower) => {
            const response = await fetch(`../../../../api/borrowManagement?action=borrowerHistory&id=${borrower.id}`);
            const history = await response.json();
            return {
              ...borrower,
              borrowHistory: history // This will be an array of borrow records
            };
          })
        );
        setBorrowersWithHistory(borrowers);
      } catch (error) {
        console.error("Error fetching borrow history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrowHistory();
  }, [searchResults]);

  // Format borrow history for display
  const formatBorrowHistory = (history) => {
    if (!history || history.length === 0) return "No Borrowing History";
    
    return (
      <div className="history-summary">
        {history.length} item(s) borrowed
        <div className="history-tooltip">
          {history.map(record => (
            <div key={record.id} className="history-item">
              <div><strong>Item:</strong> {record.item_name || record.item_id}</div>
              <div><strong>Borrowed:</strong> {new Date(record.date_borrowed).toLocaleDateString()}</div>
              <div><strong>Due:</strong> {new Date(record.return_date).toLocaleDateString()}</div>
              <div><strong>Status:</strong> {record.date_returned ? "Returned" : "Borrowed"}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const borrowers = searchResults || [];
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

  const buttons = Array.from({ length: totalPages }, (_, index) => index + 1);


  return (
    <div className="tableContainer">
      {loading && <div className="loading-indicator">Loading...</div>}
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
              currentBorrowers.map((borrower, index) => (
                <tr key={index} onDoubleClick={() => onSelectBorrower(borrower)}>
                  <td>{borrower.name}</td>
                  <td>{borrower.email}</td>
                  <td>{borrower.phone_number}</td>
                  <td>
                    {formatBorrowHistory(borrower.borrowHistory)}
                  </td>
                  <td onClick={() => onSelectBorrower(borrower)}>
                    <span className="three-dots">...</span>
                  </td>
                </tr>
              ))
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
    </div>
  );
}
