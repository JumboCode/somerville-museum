"use client";
import './EliTable.css';
import ELiUnit from '../15Tablecomp/EliUnit';
import { useState, useEffect } from "react";

export default function ELiTable() {
    const [units, setUnits] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect (() => {
        async function fetchData() {
            try {            
                const response = await fetch(`../../api/queryAll`, { 
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json' // Specify the content type
                    },
                    body: JSON.stringify({ id: id, name: name, status: status, tags: tags})
                });

                if (response.ok) {
                    const data = await response.json;
                    console.log("data selected" + data);
                    setUnits(data);
                } else {
                    console.log("failed to fetch data");
                }
                
            } catch (error) {
                console.log(error);
            }
            
        }

            fetchData();

        }, []);
        
        
    const unitsPerPage = 5;
    const startIndex = (currentPage - 1) * unitsPerPage;

    const currentUnits = units
        .slice(startIndex, startIndex + unitsPerPage)
        .map((unit) => 
            <ELiUnit key={unit.id} unit={unit} />
    );

    const totalPages = Math.ceil(currentUnits.length / unitsPerPage);

    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

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
                    <div className="num-items">
                        <p>View</p>
                        <select name="select-num" id="select-num">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    <div className="page-selection">
                        <button onClick={goToPreviousPage} disabled={currentPage === 1}>
                            Previous
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}