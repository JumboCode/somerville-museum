"use client";
import "./ReturnButton.css";
import { useState, useEffect } from "react";
import StylishButton from "./StylishButton.jsx";
import ItemBoxes from "./ReturnItemBoxes.jsx";


const ReturnPopup = ( { unit = [], onSuccess, onClose } ) => {
    if (!unit){
        return null;
    }
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(unit.length / 6 + 1);
    const buttons = Array.from({ length: totalPages }, (_, index) => index + 1); // an array of buttons for page selection

    const handleReturn = async (e) => {
        try {
            const response = await fetch('../../api/return', {   //call return API 
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    selectedItems: unit?.map(item => item.id),  //send in selected items 
                })
            });
            
            if (!response.ok) {
                throw new Error(`Fetch error: ${response.status} - ${response.statusText}`);
            }

            const result = await response.json(); 

            if (result.message) {
                alert(result.message);  //display result message 
            }

            if (onSuccess) {
                onSuccess(); 
            }

            location.reload(); // refresh to go to main inventory + update availability
        }
        catch (error) {
            console.error("Error returning data:", error);
        }
    }
    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const startIndex = (currentPage - 1) * 6;
    const selectedUnits = unit
    .slice(startIndex, startIndex + 6)
    .map((unit) => {
        return (<ItemBoxes
            key={unit.id}
            unit={unit}
        />)
    }

    );

    return (
        <div className="wrapper"> 
            {/* */}
            <div className="header" > 
                <div className="heading">Return Item(s)</div>
                <div className="buttons">
                    <StylishButton label = "Cancel" onClick={onClose} styleType = "style1"> </StylishButton>
                    <StylishButton label = "Return All" onClick={handleReturn}> </StylishButton>
                </div>
            </div>
            {/* container for all return items */}
            <div className="itemContainer">
                {/* one item -- see ReturnButton.css for details */}
                {selectedUnits}
            </div> 
            <div className="page-select">
                    <StylishButton className="leftBtn" 
                                    label = "&lt;" 
                                    onClick={goToPreviousPage} 
                                    disabled={currentPage === 1}
                                    styleType='style4'>
                    </StylishButton>
                    {buttons.map((number) => (
                        <StylishButton className="pageNum" 
                                        label={number} 
                                        key={number} 
                                        onClick={() => setCurrentPage(number)}
                                        styleType={currentPage === number ? 'style5' : 'style4'}>
                        </StylishButton>
                    ))}

                    <StylishButton className="rightBtn" 
                                    label="&gt;"
                                    onClick={goToNextPage} 
                                    disabled={currentPage === totalPages}
                                    styleType='style4'>
                    </StylishButton>
                </div>
        </div>
    );
}

export default ReturnPopup;