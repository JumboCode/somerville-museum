"use client";
import style from './15Tablecomp/Inventory.css';
import InventoryUnit from './15Tablecomp/InventoryUnit.jsx';
import { useState, useEffect } from "react";
import BorrowButton from '../components/BorrowButton.jsx';
import AddButton from '../components/AddPopup';
// import Popup from 'Popup.jsx';

export default function Inventory() {
    const [units, setUnits] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [unitsPerPage, setUnitsPerPage] = useState(10); //default units per page is 10
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
            <InventoryUnit key={"1"} unit={unit} />
    );

    const sortByName = () => {
        const filteredAndSortedEntries = [...units]
          .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
    
        setUnits(filteredAndSortedEntries);

    };

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
        
            <div className="Table">
                <div className="Header">
                    <div className="Items">
                        <div className="Searchbar">
                            <input type="text" placeholder="Search..."/>
                        </div>
                            <div className='buttons'> 
                                <AddButton className='addBtn'> </AddButton>
                                <BorrowButton className='brwBtn' >Borrow</BorrowButton>
                            </div>
                    </div>
                    <div className="TableLabels">
                        <div className="TableLabel"> ID </div>
                        <div className="TableLabel"> Availability </div>
                        <div className="TableLabel" onClick={sortByName} id='NameTag'> Name </div>
                        <div className="TableLabel"> Tags </div>
                    </div>
                </div>
                <div className="ItemBarHolder">
                    {currentUnits}
                </div>
                <div className="pagination-controls">
                    <div className="num-items">
                        <p className="view">View </p>
                        <select className="select-num" id="select-num" onChange = {handleUnitsPerPageChange}>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    <div className="page-selection">
                        <button className="leftBtn" onClick={goToPreviousPage} disabled={currentPage === 1}>
                            &lt;
                        </button>
                            {buttons.map((number) => (
                                <button className="pageNum" key={number} onClick={() => setCurrentPage(number)}>
                                    {number}
                                </button>
                            ))}
                        
                        <button className="rightBtn" onClick={goToNextPage} disabled={currentPage === totalPages}>
                            &gt;
                        </button>
                    </div>
                </div>
            </div>
        
    );
}