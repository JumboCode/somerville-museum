"use client";
import "./Borrowers.css";
import BorrowerTable from "./BorrowerTable.jsx";
import BorrowerExpanded from "./BorrowerExpanded.jsx";
import BorrowerSearchBar from "../components/BorrowerSearchBar";
import { useState, useEffect } from "react";
import { useUser } from '@clerk/nextjs';

export default function BorrowerPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const { isLoaded, user } = useUser();
  const [isApproved, setIsApproved] = useState(null);

  // Check if permissions to view page
  useEffect(() => {
    if (isLoaded && user) {
      const approved = user.publicMetadata?.approved === true;
      setIsApproved(approved);
    }
  }, [isLoaded, user]);
    

  // Handler when a borrower is selected (via row double-click or three-dots click)
  const handleSelectBorrower = (borrower) => {
    setSelectedBorrower(borrower);
  };

  // Handler to close the popup
  const handleClosePopup = () => {
    setSelectedBorrower(null);
  };

  // Conditional rendering based on user approval
  if (!isLoaded || isApproved === null) return null;

  // If user is not approved, show an error message
  if (!isApproved) {
    return (
      <div className="dashboard-container">
        <p>You are not allowed to see this section. Please wait for approval from an administrator.</p>
      </div>
    );
  }

  return (
    <>
      <div className="Items">
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
