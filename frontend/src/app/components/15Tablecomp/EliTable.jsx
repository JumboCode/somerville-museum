"use client";
import './EliTable.css';
import ELiUnit from '../15Tablecomp/EliUnit';
import { useState } from "react";

export default function ELiTable() {
       
    const [unitCount, setUnitCount] = useState(23);
    const [currentPage, setCurrentPage] = useState(1);
    const unitsPerPage = 5;

    const totalPages = Math.ceil(unitCount / unitsPerPage);

    const startIndex = (currentPage - 1) * unitsPerPage;

    const currentUnits = Array.from({ length: unitCount })
        .slice(startIndex, startIndex + unitsPerPage)
        .map((_, index) => <ELiUnit key={startIndex + index} />);

    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };S

    return (
        <>
            <div className="Table">
                <div className="Header">
                    <div className="Items">
                        <div className="Searchbar">
                            <input type="text" placeholder="Search..."/>
                        </div>
                            <div className='buttons'> 
                                <button className='addBtn'>ADD</button>
                                <button className='brwBtn'>BORROW</button>
                            </div>
                    </div>
                    <div className="TableLabels">
                        <div className="TableLabel"> ID </div>
                        <div className="TableLabel"> Name </div>
                        <div className="TableLabel"> Status </div>
                        <div className="TableLabel"> Tags </div>
                    </div>
                </div>
                <div className="ItemBarHolder">
                    {currentUnits}
                </div>
                <div className="pagination-controls">
                    <button onClick={goToPreviousPage} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button onClick={goToNextPage} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            </div>
        </>
    );
}