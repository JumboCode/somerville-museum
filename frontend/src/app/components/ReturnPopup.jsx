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
        try {
            // const response = await fetch('/api/borrowManagement?action=return', {   
            //     method: 'PUT',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ 
            //         selectedItems: units.map(item => item.id),
            //         notes_id: Object.keys(notes),
            //         notes_content: Object.values(notes)
            //     })
            // });
            
            // if (!response.ok) {
            //     throw new Error(`Fetch error: ${response.status} - ${response.statusText}`);
            // }

        //EMAIL FOR RETURN ITEMS BELOW

        const itemNames = units.map(item => item.name);

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
        const groupResponse = await fetch('/api/borrowManagement?action=groupReturnsByBorrower', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ returnedItems: units.map(item => item.id) })
        });

        if (!groupResponse.ok) {
            throw new Error(`Group API error: ${groupResponse.status} - ${groupResponse.statusText}`);
        }

        const groupedData = await groupResponse.json();

        console.log("Grouped data:", groupedData);
        const { borrower_email: borrowerEmail, borrower_first_name: borrowerFirstName, borrower_last_name: borrowerLastName } = groupedData[0];

        // Debugging: Log the request payload
        console.log("Sending email request:", {
            recipientEmail: borrowerEmail,
            recipientName: `${borrowerFirstName} ${borrowerLastName}`,
            items: itemNames,
        });

        // Make the API call
        if (!isToggleEnabled) {
            const emailResponse = await fetch('/api/email?emailType=sendReturnEmail', { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipientEmail: borrowerEmail,
                    recipientName: `${borrowerFirstName} ${borrowerLastName}`,
                    items: itemNames,
                }),
            });

            // Read response as text (to catch non-JSON errors)
            const responseText = await emailResponse.text();

            if (!emailResponse.ok) {
                throw new Error(`Email sending failed: ${emailResponse.status} ${responseText}`);
            }
        }

        //EMAIL FOR RETURN ITEMS ABOVE

            const result = await response.json(); 
            if (result.message) alert(result.message);
            if (onSuccess) onSuccess(); 

            location.reload(); 
        } catch (error) {
            console.error("Error returning data:", error);
        }
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
        <div className="wrapper"> 
            <div className="header">
                <div className="heading">Return Item(s)
                    <div className="buttons">
                        <StylishButton label="Cancel" onClick={onClose} styleType="style1" />
                        <StylishButton label="Return All" onClick={handleReturn} styleType="style3" />
                    </div>
                </div>
            </div>
            <div className="itemContainer">
                {selectedUnits}
            </div> 
            <div className="page-select">
                <StylishButton className="leftBtn" label="&lt;" onClick={goToPreviousPage} disabled={currentPage === 1} styleType='style4' />
                {buttons.map((number) => (
                    <StylishButton className="pageNum" label={number} key={number} onClick={() => setCurrentPage(number)} styleType={currentPage === number ? 'style5' : 'style4'} />
                ))}
                <StylishButton className="rightBtn" label="&gt;" onClick={goToNextPage} disabled={currentPage === totalPages} styleType='style4' />
            </div>
        </div>
    );
};

export default ReturnPopup;
