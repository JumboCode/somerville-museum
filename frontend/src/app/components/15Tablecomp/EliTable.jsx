"use client";
import './EliTable.css';
import ELiUnit from '../15Tablecomp/EliUnit';
import { useState, useEffect } from "react";

export default function ELiTable() {
    const [units, setUnits] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [unitsPerPage, setUnitsPerPage] = useState(10); //default units per page is 10
    const [unitLength, setUnitLength] = useState(0);
    const [totalPages, setTotalPages] = useState();


    useEffect (() => {
        async function fetchData() {
            try {            
                const response = await fetch(`../../api/queryAll`, { 
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json' // Specify the content type
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("data selected" + data);
                    setUnits(data);
                    setUnitLength(data.length);
                    setTotalPages(Math.ceil(data.length / 10));
                } else {
                    console.log("failed to fetch data");
                }
                
            } catch (error) {
                console.log(error);
            }
            
        }

            fetchData();

        }, []);
        
    const startIndex = (currentPage - 1) * unitsPerPage;

    const currentUnits = units
        .slice(startIndex, startIndex + unitsPerPage)
        .map((unit) => 
            <ELiUnit key={unit.id} unit={unit} />
    );

    

    //tesing piece of code
    // const totalPages = Math.ceil(20 / unitsPerPage);

    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    // event handler for the select dropdown, return to page one and 
    // set units to the selected value
    const handleUnitsPerPageChange = (event) => {
        setUnitsPerPage(Number(event.target.value));
        setCurrentPage(1); 
        setTotalPages(Math.ceil(units.length/ Number(event.target.value)));//by default set the current page to 1
    };

    // an array of buttons for page selection
    const buttons = Array.from({ length: totalPages}, (_, index) => index + 1);

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
                        <select name="select-num" id="select-num" onChange = {handleUnitsPerPageChange}>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    <div className="page-selection">
                        <button onClick={goToPreviousPage} disabled={currentPage === 1}>
                            &lt;
                        </button>
                        {/* <span>Page {currentPage} of {totalPages}</span> */}
                        
                            {buttons.map((number) => (
                                <button key={number} onClick={() => setCurrentPage(number)}>
                                    {number}
                                </button>
                            ))}
                        
                        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
                            &gt;
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}