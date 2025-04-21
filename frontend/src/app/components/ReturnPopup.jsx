"use client";
import "./ReturnButton.css";
import { useState, useEffect } from "react";
import StylishButton from "./StylishButton.jsx";
import ItemBoxes from "./ReturnItemBoxes.jsx";

const ReturnPopup = ({ units = [], onSuccess, onClose }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(units.length / 6);
    const buttons = Array.from({ length: totalPages }, (_, index) => index + 1); 
    const [notes, setNotes] = useState({});
    const [selectedUnits, setSelectedUnits] = useState([]);
    const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);
     


    useEffect(() => {
        // Update selectedUnits when units or page changes
        const startIndex = (currentPage - 1) * 6;
        setSelectedUnits(units.slice(startIndex, startIndex + 6).map((unit) => (
            <ItemBoxes
                key={unit.id}
                unit={unit}
                onNotesChange={handleNotesChange}
                onClose={() => handleDeselect(unit)}
            />
        )));
    }, [units, currentPage]);

    const handleReturn = async () => {
        //try {

        //EMAIL FOR RETURN ITEMS BELOW

        //const itemNames = units.map(item => item.name);

        // // Fetch the borrower's ID based on the first selected item
        // const borrowerID = await fetch (`/api/fetchBorrowerId?id=${units[0].id}`);
        // if (!borrowerId.ok) {
        //     throw new Error(`Failed to fetch borrower ID: ${borrowerId.status}`);
        // }
        // const { borrower_id: borrowerId } = await borrowerID.json();

        // // Fetch the borrower's email using the first item's borrower_id
        // console.log("Borrower id:" + borrower_id);
        // const borrowerEmailResponse = await fetch(`/api/fetchBorrowerEmail?id=${borrower_id}`);
        // if (!borrowerEmailResponse.ok) {
        //     throw new Error(`Failed to fetch borrower email: ${borrowerEmailResponse.status}`);
        // }
        // const { borrower_email: borrowerEmail } = await borrowerEmailResponse.json();

        // const borrowerNameResponse = await fetch(`/api/fetchBorrowerName?id=${borrowerId}`);
        // if (!borrowerNameResponse.ok) {
        //     throw new Error(`Failed to fetch borrower name: ${borrowerNameResponse.status}`);
        // }
        // const { borrower_first_name: borrowerFirstName, borrower_last_name: borrowerLastName } = await borrowerNameResponse.json();

        // Step 2: Call the groupReturnsByBorrowerHandler API

        ////////////////////////////////////////////////////

        // try {
        //     const response = await fetch('/api/borrowManagement?action=groupReturnsByBorrower', {
        //       method: 'POST',
        //       headers: { 'Content-Type': 'application/json' },
        //       body: JSON.stringify({ returnedItems: units.map(item => item.id) }),
        //     });
        
        //     if (!response.ok) {
        //       throw new Error(`Group API error: ${response.status} - ${response.statusText}`);
        //     }
        
        //     const result = await response.json();
        //     console.log(result.message); // Should log: Emails sent to all borrowers.
        
        //     if (onSuccess) onSuccess();
        
        //     location.reload();
        
        // } catch (error) {
        //     console.error("Error returning data:", error);
        // }

        // try {
        //     const response = await fetch('../../api/borrowManagement?action=return', {   
        //         method: 'PUT',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({ 
        //             selectedItems: units.map(item => item.id),
        //             notes_id: Object.keys(notes),
        //             notes_content: Object.values(notes)
        //         })
        //     });
            
        //     if (!response.ok) {
        //         throw new Error(`Fetch error: ${response.status} - ${response.statusText}`);
        //     }

        //     const result = await response.json(); 
        //     if (result.message) alert(result.message);
        //     if (onSuccess) onSuccess(); 

        //     location.reload(); 
        // } catch (error) {
        //     console.error("Error returning data:", error);
        // }
        // if (selectedUnits == 0) {
        //   alert('No items selected.'); 
        // } else {

          try {
            // 1. Send Emails first
            const emailResponse = await fetch('/api/borrowManagement?action=groupReturnsByBorrower', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ returnedItems: units.map(item => item.id) }),
            });
        
            if (!emailResponse.ok) {
              throw new Error(`Group API error: ${emailResponse.status} - ${emailResponse.statusText}`);
            }
        
            const emailResult = await emailResponse.json();
            console.log(emailResult.message);  // Should log: Emails sent to all borrowers.
        
            // 2. THEN update DB
            const returnResponse = await fetch('/api/borrowManagement?action=return', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                selectedItems: units.map(item => item.id),
                notes_id: Object.keys(notes),
                notes_content: Object.values(notes),
              }),
            });
        
            if (!returnResponse.ok) {
              throw new Error(`Fetch error: ${returnResponse.status} - ${returnResponse.statusText}`);
            }
        
            const returnResult = await returnResponse.json();
            
            // Show success popup instead of alert
            setIsSuccessPopupVisible(true);
            
            // Don't immediately reload - this will happen when user confirms in popup
        
        } catch (error) {
            console.error("Error returning data:", error);
        }

        // }

        
    };

    const goToPreviousPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    const goToNextPage = () => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));

    const handleNotesChange = (id, value) => {
        setNotes(prev => ({ ...prev, [id]: value }));
    };

    const handleDeselect = (removeUnit) => {
        const updatedUnits = units.filter(unit => unit.id !== removeUnit.id);
        setSelectedUnits(updatedUnits.slice(0, 6).map(unit => (
            <ItemBoxes
                key={unit.id}
                unit={unit}
                onNotesChange={handleNotesChange}
                onClose={() => handleDeselect(unit)}
            />
        )));

        if (updatedUnits.length === 0) location.reload();
    };

    return (
        <div> 
             <div className="wrapper"> 
            <div className="header">
                <div className="heading">Return Item(s)
                    <div className="buttons">
                        <StylishButton label="Cancel" onClick={onClose} styleType="style1" />
                        <StylishButton label="Return All" onClick={handleReturn} styleType="style3" />
                    </div>
                </div>
            </div>
            {selectedUnits.length > 0 ? (
              <> 
              <div className="itemContainer">
                {selectedUnits}
              </div> 
              </>
            ): (
              <p>No items selected.</p>
            )}
            
            <div className="page-select">
                <StylishButton className="leftBtn" label="&lt;" onClick={goToPreviousPage} disabled={currentPage === 1} styleType='style4' />
                {buttons.map((number) => (
                    <StylishButton className="pageNum" label={number} key={number} onClick={() => setCurrentPage(number)} styleType={currentPage === number ? 'style5' : 'style4'} />
                ))}
                <StylishButton className="rightBtn" label="&gt;" onClick={goToNextPage} disabled={currentPage === totalPages} styleType='style4' />
            </div>
        </div>
        <div> 


        {isSuccessPopupVisible && (
        <div className="success-popup-overlay">
          <div className="success-popup">
          <svg xmlns="http://www.w3.org/2000/svg" width="106" height="106" viewBox="0 0 106 106" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M65.1795 34.7891C65.4837 34.9582 65.7516 35.1856 65.9679 35.4583C66.1841 35.7309 66.3446 36.0435 66.4401 36.3781C66.5356 36.7128 66.5642 37.063 66.5243 37.4087C66.4845 37.7545 66.3769 38.089 66.2077 38.3931L51.4896 64.8931C51.3205 65.1973 51.0931 65.4651 50.8205 65.6814C50.5478 65.8977 50.2352 66.0581 49.9006 66.1536C49.5659 66.2491 49.2157 66.2777 48.87 66.2379C48.5243 66.198 48.1898 66.0904 47.8856 65.9213C47.5815 65.7522 47.3136 65.5248 47.0973 65.2521C46.8811 64.9795 46.7206 64.6669 46.6251 64.3323C46.5296 63.9976 46.501 63.6474 46.5409 63.3017C46.5807 62.956 46.6883 62.6215 46.8574 62.3173L61.5755 35.8173C61.7447 35.5131 61.972 35.2453 62.2447 35.029C62.5173 34.8127 62.8299 34.6522 63.1646 34.5568C63.4992 34.4613 63.8494 34.4327 64.1952 34.4725C64.5409 34.5124 64.8754 34.62 65.1795 34.7891Z" fill="#3FA400"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M32.3832 50.1698C32.8222 49.6222 33.4605 49.2712 34.158 49.1937C34.8555 49.1162 35.5553 49.3186 36.1038 49.7564L50.8272 61.533C51.3761 61.9722 51.728 62.6115 51.8056 63.3103C51.8831 64.009 51.6799 64.71 51.2406 65.2589C50.8013 65.8078 50.162 66.1597 49.4633 66.2372C48.7645 66.3147 48.0636 66.1115 47.5147 65.6723L32.7966 53.901C32.5247 53.6835 32.2984 53.4146 32.1304 53.1097C31.9625 52.8047 31.8563 52.4697 31.8179 52.1237C31.7795 51.7777 31.8097 51.4275 31.9067 51.0931C32.0037 50.7588 32.1656 50.4468 32.3832 50.1751" fill="#3FA400"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M22.2495 21.6081C21.4113 22.4433 20.7512 23.44 20.3094 24.5378C19.8675 25.6355 19.6531 26.8116 19.679 27.9946C19.732 30.9096 18.99 33.9942 17.9141 36.6654C16.8382 39.3419 15.2323 42.082 13.1759 44.1437C11.5302 45.7931 10.6059 48.028 10.6059 50.358C10.6059 52.688 11.5302 54.9228 13.1759 56.5722C16.9389 60.3405 19.5677 66.4991 19.679 71.8309C19.7209 74.0547 20.6065 76.1795 22.1565 77.7747C23.7064 79.37 25.8048 80.3164 28.0265 80.4222C30.9415 80.5653 34.0102 81.4504 36.7026 82.6482C39.3897 83.8407 42.1033 85.5208 44.165 87.5825C45.8144 89.2283 48.0493 90.1525 50.3793 90.1525C52.7093 90.1525 54.9442 89.2283 56.5935 87.5825C58.6552 85.5208 61.3635 83.8407 64.0559 82.6429C66.7483 81.4504 69.817 80.5653 72.732 80.4222C74.9542 80.3176 77.0533 79.3716 78.6035 77.7761C80.1537 76.1806 81.0389 74.0551 81.0795 71.8309C81.1855 66.4991 83.8143 60.3405 87.5826 56.5669C89.2268 54.9178 90.15 52.684 90.15 50.3553C90.15 48.0266 89.2268 45.7929 87.5826 44.1437C85.5209 42.082 83.9203 39.3419 82.8444 36.6707C81.7632 33.9942 81.0212 30.9043 81.0795 27.9946C81.1048 26.8112 80.8895 25.6349 80.4467 24.5372C80.004 23.4394 79.343 22.4429 78.5037 21.6081C77.6368 20.7367 76.5958 20.0579 75.4488 19.6159C74.3018 19.1739 73.0745 18.9786 71.8469 19.0429C66.5681 19.3079 60.33 16.9123 56.5935 13.1758C54.9442 11.5301 52.7093 10.6058 50.3793 10.6058C48.0493 10.6058 45.8144 11.5301 44.165 13.1758C40.4285 16.9123 34.1904 19.3079 28.9116 19.0429C27.6832 18.9779 26.4549 19.1727 25.3069 19.6148C24.1589 20.0568 23.1171 20.736 22.2495 21.6081ZM14.379 28.09C14.4585 32.1074 12.2696 37.5505 9.42353 40.3913C6.78419 43.0346 5.30176 46.6173 5.30176 50.3527C5.30176 54.088 6.78419 57.6707 9.42353 60.314C12.2325 63.1177 14.2995 67.9725 14.379 71.9316C14.4532 75.4402 15.8259 78.9276 18.5024 81.6041C20.9718 84.0785 24.2751 85.5431 27.7668 85.7116C31.9591 85.9236 37.4499 88.3563 40.4179 91.3296C43.0612 93.969 46.6439 95.4514 50.3793 95.4514C54.1147 95.4514 57.6974 93.969 60.3406 91.3296C63.3086 88.3563 68.7994 85.9236 72.9917 85.7116C76.4834 85.5431 79.7868 84.0785 82.2561 81.6041C84.8292 79.0346 86.3054 75.5673 86.3742 71.9316C86.459 67.9725 88.526 63.1177 91.3297 60.314C93.9691 57.6707 95.4515 54.088 95.4515 50.3527C95.4515 46.6173 93.9691 43.0346 91.3297 40.3913C88.4889 37.5505 86.2947 32.1074 86.3795 28.0953C86.4202 26.1976 86.0757 24.3114 85.367 22.5506C84.6583 20.7898 83.6 19.1908 82.2561 17.8504C80.864 16.4546 79.1936 15.3675 77.3536 14.6598C75.5137 13.9521 73.5453 13.6397 71.5766 13.7429C67.7924 13.9337 63.0171 12.0999 60.3406 9.41812C57.6971 6.77716 54.1133 5.2937 50.3766 5.2937C46.64 5.2937 43.0561 6.77716 40.4126 9.41812C37.7414 12.0999 32.9608 13.9337 29.1766 13.7429C27.2088 13.6405 25.2415 13.9533 23.4025 14.6609C21.5635 15.3686 19.894 16.4553 18.5024 17.8504C17.1592 19.1902 16.1013 20.7883 15.3926 22.5481C14.6839 24.308 14.3391 26.1932 14.379 28.09Z" fill="#3FA400"/>
          </svg>
            <h2>Return Success</h2>
            <p>The following items have been returned:</p>
            <h2>{units.map(item => item.id).join(", ")}</h2>

            <p>Thank you!</p>
            <button onClick={() => {
              onSuccess();
              // Optional: reload the page after success
              // location.reload();
            }}>Return to Inventory</button>
          </div>
        </div>
      )}
        </div>

        </div>
       
    );
};

export default ReturnPopup;