"use client";
import React, { useState, useEffect } from "react";
import "../globals.css";
import "./BorrowerTable.css";
import StylishButton from "../components/StylishButton";
import BorrowerExpanded from "./BorrowerExpanded";

export default function BorrowerTable({ searchResults, onSelectBorrower }) {
  const [allBorrowers, setAllBorrowers] = useState([]);
  const [enhancedBorrowers, setEnhancedBorrowers] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedBorrowerIndex, setSelectedBorrowerIndex] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Format history summary for display
  const formatHistorySummary = (history) => {
    if (!history || history.length === 0) return "No history";
    
    const activeLoans = history.filter(loan => !loan.date_returned).length;
    const totalLoans = history.length;
    
    return `${activeLoans} active / ${totalLoans} total`;
  };

  // Fetch and enhance borrower data with history
  useEffect(() => {
    const fetchAllBorrowers = async () => {
      try {
        const response = await fetch('/api/borrowManagement?action=getAllBorrowers');
        if (!response.ok) throw new Error("Failed to fetch borrowers");
        const data = await response.json();
        setAllBorrowers(data);
      } catch (error) {
        console.error("Error fetching all borrowers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBorrowers();
  }, []);

  useEffect(() => {
    const enhanceBorrowersWithHistory = async () => {
      const borrowersToEnhance = searchResults?.length > 0 ? searchResults : allBorrowers;
      
      if (!borrowersToEnhance || borrowersToEnhance.length === 0) {
        setEnhancedBorrowers([]);
        return;
      }

      setLoading(true);
      try {
        const enhanced = await Promise.all(
          borrowersToEnhance.map(async (borrower) => {
            try {
              const response = await fetch(`/api/borrowManagement?action=borrowerHistory&id=${borrower.id}`);
              if (!response.ok) throw new Error("Failed to fetch history");
              const history = await response.json();
              return { ...borrower, borrowHistory: history };
            } catch (error) {
              console.error(`Error fetching history for borrower ${borrower.id}:`, error);
              return { ...borrower, borrowHistory: [] };
            }
          })
        );
        setEnhancedBorrowers(enhanced);
      } catch (error) {
        console.error("Error enhancing borrowers:", error);
        setEnhancedBorrowers([]);
      } finally {
        setLoading(false);
      }
    };

    enhanceBorrowersWithHistory();
  }, [searchResults, allBorrowers]);

  // Pagination calculations
  const totalPages = Math.ceil(enhancedBorrowers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBorrowers = enhancedBorrowers.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [enhancedBorrowers, itemsPerPage, totalPages]);

  // Pagination handlers
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

  const pageButtons = Array.from({ length: totalPages }, (_, index) => index + 1);
  // const handleSelectBorrower = (borrower) => {
  //   const index = borrowers.findIndex(b => b.email === borrower.email); // Use unique field
  //   if (index !== -1) {
  //     setSelectedBorrowerIndex(index);
  //     setShowPopup(true);
  //   }
  // };

  // const buttons = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="tableContainer">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading borrower data...</p>
        </div>
      )}

      <div className="tableContent">
        <table id="borrowerInfo">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Borrow Activity</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentBorrowers.length > 0 ? (
              currentBorrowers.map((borrower) => (
                <tr key={borrower.id} onDoubleClick={() => onSelectBorrower(borrower)}>
                  <td>{borrower.name}</td>
                  <td>{borrower.email}</td>
                  <td>{borrower.phone_number}</td>
                  <td>{formatHistorySummary(borrower.borrowHistory)}</td>
                  <td onClick={() => onSelectBorrower(borrower)}>
                    <span className="three-dots">...</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  {loading ? "Loading..." : "No borrowers found"}
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
          {pageButtons.map((number) => (
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