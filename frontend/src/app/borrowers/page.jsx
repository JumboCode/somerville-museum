"use client";
import "./Borrowers.css";
import BorrowerTable from "./BorrowerTable.jsx";
import BorrowerExpanded from "./BorrowerExpanded.jsx";
import BorrowerSearchBar from "../components/BorrowerSearchBar";
import { useState } from "react";

export default function BorrowerPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBorrower, setSelectedBorrower] = useState(null);

  // Handler when a borrower is selected (via row double-click or three-dots click)
  const handleSelectBorrower = (borrower) => {
    setSelectedBorrower(borrower);
  };

  // Handler to close the popup
  const handleClosePopup = () => {
    setSelectedBorrower(null);
  };

  return (
    <>
      <div className="items">
        <BorrowerSearchBar updateSearchResults={setSearchResults} />
        <BorrowerTable 
          searchResults={searchResults} 
          onSelectBorrower={handleSelectBorrower} 
        />
      </div>
      {selectedBorrower && (
        <BorrowerExpanded 
          borrower={selectedBorrower} 
          onClose={handleClosePopup} 
        />
      )}
    </>
  );
}
