"use client";
import './EliTable.css';
import ELiUnit from '../15Tablecomp/EliUnit';
import BorrowButton from '../BorrowButton';
import ReturnButton from '../ReturnButton';
import { useState, useEffect } from "react";

export default function ELiTable() {
    const [units, setUnits] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [unitsPerPage, setUnitsPerPage] = useState(10); //default units per page is 10
    const [totalPages, setTotalPages] = useState();
    const [selectedItems, setSelectedItems] = useState([]); 


    useEffect (() => {
        fetchData();
    }, []);

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
                
                // Add overdue calculation
                const currentDate = new Date();
                //logic for checking overdue? Does not automatically update table
                const updatedData = data.map((item) => {
                    if (item.status === 'Borrowed' && item.dueDate && new Date(item.dueDate) < currentDate) {
                        return { ...item, status: 'Overdue' };
                    }
                    return item;
                });


                setUnits(updatedData);
                setTotalPages(Math.ceil(updatedData.length / unitsPerPage));

                // if (overdueItems.length > 0) {
                //     await updateOverdueItems(overdueItems);
                // }

               
            } else {
                console.error("failed to fetch data");
            }
            
        } catch (error) {
            console.error(error); 
        }
        
    };

    //POSSIBLE ASYNC FUNCTION FOR OVERDUE 
    // async function updateOverdueItems(items, currentDate = new Date()) {
    //     if (!Array.isArray(items)) {
    //         throw new Error("Invalid input: items must be an array.");
    //     }
    
    //     return items.map((item) => {
    //         if (item.status === 'Borrowed' && item.dueDate && new Date(item.dueDate) < currentDate) {
    //             return { ...item, status: 'Overdue' };
    //         }
    //         return item;
    //     });
    // }

    //POSSIBLE FUNCTION FOR UPDATING WITH AN 'OVERDUE' API

    // async function syncOverdueStatus(overdueItems) {
    //     if (overdueItems.length === 0) return; // No overdue items to update
    
    //     try {
    //         const response = await fetch(`../../api/overdue`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(overdueItems),
    //         });
    
    //         if (!response.ok) {
    //             console.log('Failed to update overdue status in the database');
    //         }
    //     } catch (error) {
    //         console.log('Error updating overdue status:', error);
    //     }
    // }


    const handleBorrowSuccess = () => {
        // Refetch data to update the table after borrowing
        fetchData();
        };
        
    //function to track which items are checked on table 
    const handleCheckboxChange = (unit) => {
        
        setSelectedItems((prevSelected) => {
            if (prevSelected.some((item) => item.id === unit.id)) {
                return prevSelected.filter((item) => item.id !== unit.id);
            } else {
                return [...prevSelected, unit];
            }
        });

    };


    const startIndex = (currentPage - 1) * unitsPerPage;

    const currentUnits = units
        .slice(startIndex, startIndex + unitsPerPage)
        .map((unit) => 
            <ELiUnit key={unit.id} 
            unit={unit} 
            onChange={() => handleCheckboxChange(unit)}
            checked={selectedItems.includes(unit)}
            />
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
        
            <div className="Table">
                <div className="Header">
                    <div className="Items">
                        <div className="Searchbar">
                            <input type="text" placeholder="Search..."/>
                        </div>
                            <div className='buttons'> 
                                <button className='addBtn'>ADD</button>
                                <BorrowButton className='brwBtn'  //added borrow button here
                                selectedItems = {selectedItems} 
                                onSuccess = {handleBorrowSuccess}
                                >BORROW</BorrowButton>
                                <ReturnButton className='brwBtn' //added return button here
                                selectedItems = {selectedItems}
                                onSuccess={handleBorrowSuccess}
                                >RETURN</ReturnButton>

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
        
    );
}