"use client";
import "./ReturnButton.css";
import { useState, useEffect } from "react";
import StylishButton from "./StylishButton.jsx";
import ItemBoxes from "./ReturnItemBoxes.jsx";


export default function ReturnPopup( { unit, onClose } ) {
    if (!unit){
        return null;
    }
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(unit.length / 6 + 1);
    const buttons = Array.from({ length: totalPages }, (_, index) => index + 1); // an array of buttons for page selection
    // const { id, name, status, tags } = unit; // change
    // const startIndex = (currentPage - 1) * unitsPerPage;
    // const currentUnits = units
    //     .slice(startIndex, startIndex + unitsPerPage)
    //     .map((unit) => {
    //         console.log(selectedItems);
    //         return (<InventoryUnit
    //             key={unit.id}
    //             unit={unit}
    //             onChange={handleCheckboxChange}
    //             checked={selectedItems.some((item) => item?.id && unit?.id && item.id === unit.id)}
    //         />)
    //     });

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
                    <StylishButton label = "Return All"> </StylishButton>
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