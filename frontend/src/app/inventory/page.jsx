// inventory/page.jsx
"use client";
// import style from './15Tablecomp/Inventory.css';
import InventoryUnit from './15Tablecomp/InventoryUnit.jsx';
import { useState, useEffect } from "react";
import { useFilterContext } from '../components/contexts/FilterContext.js';
import BorrowButton from '../components/BorrowButton.jsx';
import AddButton from '../components/AddPopup';
import ReturnButton from '../components/ReturnButton';
import Filter from '../components/Filter/Filter';
import './inventory.css'
// import Popup from 'Popup.jsx';

export default function Inventory({ isFilterVisible, toggleFilterVisibility }) {
    const { selectedFilters, triggerFilteredFetch } = useFilterContext();
    const [units, setUnits] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [unitsPerPage, setUnitsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState();
    const [selectedItems, setSelectedItems] = useState([]);
    const [refreshTable, setRefreshTable] = useState(false); 
    useEffect(() => {
        console.log("FILTERS", selectedFilters)
        fetch("../../api/fetchInventoryByTag", { 
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json' 
                },
                body: JSON.stringify(selectedFilters)
              }).then((response) => {
                if (!response.ok) {
                    console.log("ERROR UNABLE TO GET FILTERED ITEMS")
                    return null;
                }
                return response.json()
              }).then((data) => {
                if (!data) return;
                console.log(data);
                setUnits(data);
              });
    }, [selectedItems, triggerFilteredFetch, refreshTable]);

    useEffect(() => {
        console.log('Filter Visibility Changed:', isFilterVisible);
    }, [isFilterVisible]);

    async function fetchData() {
        console.log("IM BEING CALLED")
        try {
            const response = await fetch(`../../api/fetchInventoryByTag`, { 
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                  tags: selectedFilters
                })
              });

            if (response.ok) {
                const data = await response.json();
                const currentDate = new Date();
                const updatedData = data.map((item) => {
                    if (item.status === 'Borrowed' && item.dueDate && new Date(item.dueDate) < currentDate) {
                        return { ...item, status: 'Overdue' };
                    }
                    return item;
                });

                setUnits(updatedData);
                setTotalPages(Math.ceil(updatedData.length / unitsPerPage));
            } else {
                console.error("failed to fetch data");
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleBorrowSuccess = () => {
        // Literally just to call the useeffect with the request. kinda scuffed but whatever
        setRefreshTable(!refreshTable);
    };

    const handleCheckboxChange = (unit, isChecked) => {
        setSelectedItems((prevSelected) => {
            if (isChecked) {
                return [unit, ...prevSelected];
            } else {
                return prevSelected.filter(item => item.id !== unit.id);
            }
        });
    };

    const startIndex = (currentPage - 1) * unitsPerPage;
    const currentUnits = units
        .slice(startIndex, startIndex + unitsPerPage)
        .map((unit) => {
            // console.log(selectedItems);
            return (<InventoryUnit
                key={unit.id}
                unit={unit}
                onChange={handleCheckboxChange}
                checked={selectedItems.some((item) => item?.id && unit?.id && item.id === unit.id)}
            />)
        }

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
        setTotalPages(Math.ceil(units.length / Number(event.target.value)));//by default set the current page to 1
    };

    // an array of buttons for page selection
    const buttons = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <>
            <Filter 
                isVisible={isFilterVisible} 
                onClose={toggleFilterVisibility} 
                className={isFilterVisible ? 'visible' : ''}
            />
            <div className={`Table ${isFilterVisible ? 'shrink' : ''}`}>
                <div className="Header">
                    <div className="Items">
                        <div className="Searchbar">
                            <input type="text" placeholder="Search..." />
                        </div>
                            <div className='buttons'> 
                                <AddButton className='addBtn'> </AddButton>
                                <BorrowButton className='brwBtn'
                                    selectedItems={selectedItems}
                                    onSuccess={handleBorrowSuccess}>Borrow
                                </BorrowButton>
                                <ReturnButton className='brwBtn'
                                    selectedItems={selectedItems}
                                    onSuccess={handleBorrowSuccess}>
                                </ReturnButton>
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
                        <select className="select-num" id="select-num" onChange={handleUnitsPerPageChange}>
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
        </>

    );
}