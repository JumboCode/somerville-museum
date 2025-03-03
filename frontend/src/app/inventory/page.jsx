// inventory/page.jsx
"use client";
import './15Tablecomp/Inventory.css';

import './15Tablecomp/Inventory.css';
import InventoryUnit from './15Tablecomp/InventoryUnit.jsx';
import { useState, useEffect } from "react";
import { useFilterContext } from '../components/contexts/FilterContext.js';
import BorrowButton from '../components/BorrowButton.jsx';
import AddButton from '../components/AddItemButton';
import ReturnButton from '../components/ReturnButton';
import DeleteItemButton from '../components/DeleteItemButton';
import StylishButton from '../components/StylishButton.jsx';
import Filter from '../components/Filter/Filter';
import SearchBar from '../components/SearchBar';
import './inventory.css'

import PropTypes from 'prop-types';

Inventory.propTypes = {
    isFilterVisible: PropTypes.bool.isRequired,
    toggleFilterVisibility: PropTypes.func.isRequired,
};

export default function Inventory({ 
    isFilterVisible = false, 
    toggleFilterVisibility = () => {} 
  }) {
    const { selectedFilters, triggerFilteredFetch } = useFilterContext();
    const [units, setUnits] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [unitsPerPage, setUnitsPerPage] = useState(15);
    const [totalPages, setTotalPages] = useState();
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [filterResults, setFilterResults] = useState([]);
    
    const [refreshTable, setRefreshTable] = useState(false);
     
    useEffect(() => {
        console.log("FILTERS", selectedFilters)
        fetch("../../api/inventoryQueries?action=fetchInventoryByTag", { 
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json' 
                },
                body: JSON.stringify(selectedFilters)
              }).then(async (response) => {
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error fetching filtered items:", errorData);
                    throw new Error(errorData.error || 'Failed to fetch filtered items');
                }
                return response.json()
              }).then((data) => {
                setFilterResults(data);
              })
              .catch((error) => {
                console.error("Failed to fetch or process data:", error);                
            });
    }, [selectedItems, triggerFilteredFetch, refreshTable]);

    // Called any time new filters/search results are applied to update displayed units
    useEffect(() => {
        // Takes intersection of search results and filter results to get correct ones.
        const filteredAndSearchResults = () => {
            const filteredUnitIds = new Set(filterResults.map(unit => unit.id));
            return searchResults.filter(item => filteredUnitIds.has(item.id));
        };
        
        setUnits(filteredAndSearchResults())
    }, [searchResults, filterResults])

    const [selectAllChecked, setSelectAllChecked] = useState(false);
    
    useEffect(() => {
        fetchData();
    }, [selectedItems]);

    async function fetchData() {

        try {
            const response = await fetch(`../../api/inventoryQueries?action=fetchInventoryByTag`, { 
                method: 'PUT',
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
                    if (item.status === "Borrowed" && item.dueDate && new Date(item.dueDate) < currentDate) {
                        return { ...item, status: "Overdue" };
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
        fetchData(); 
        setRefreshTable(prev => !prev);

        setSelectedItems([]); 

    };
  

    const handleReturnSuccess = () => {
        setRefreshTable(prev => !prev); // Refresh table to show updated status
        setSelectedItems([]); // Clear selected items
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

    const handleSelectAllChange = () => {
        if (selectAllChecked) {
            setSelectedItems([]);
        } else {
            setSelectedItems([...units]);
        }
        setSelectAllChecked(!selectAllChecked);
    };

    const startIndex = (currentPage - 1) * unitsPerPage;
    const currentUnits = units
        .slice(startIndex, startIndex + unitsPerPage)
        .map((unit) => {

            return (<InventoryUnit
                key={unit.id}
                unit={unit}
                onChange={handleCheckboxChange}
                checked={selectedItems.some((item) => item?.id && unit?.id && item.id === unit.id)}
            />)
        });

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
                        <SearchBar updateSearchResults={setSearchResults} />
                            <div className='buttons'> 
                                <AddButton className='addBtn'> </AddButton>
                                <BorrowButton className='brwBtn'
                                    selectedItems={selectedItems}
                                    onSuccess={handleBorrowSuccess}>Borrow
                                </BorrowButton>
                                <ReturnButton className='rtnBtn'
                                    selectedItems={selectedItems}
                                    onSuccess={handleReturnSuccess}>Return
                                </ReturnButton>
                                <DeleteItemButton
                                    classname = 'delBtn'
                                    selectedItems={selectedItems}
                                    isChecked={selectedItems.length > 0}
                                    >
                                </DeleteItemButton>
                            </div>
                    </div>
                    <div className="TableLabels">
                        <div className="SelectAll" id='SelectAll'
                        onClick={handleSelectAllChange}
                        >
                            Select All
                        </div>
                        <div className="IDLabel"> ID 
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                                <path d="M8.39936 5.14825C8.48416 5.23294 8.5991 5.28051 8.71894 5.28051C8.83878 5.28051 8.95372 5.23294 9.03852 5.14825L9.47266 4.71411V10.8584C9.47266 10.9784 9.5203 11.0934 9.60511 11.1782C9.68992 11.263 9.80495 11.3106 9.92489 11.3106C10.0448 11.3106 10.1599 11.263 10.2447 11.1782C10.3295 11.0934 10.3771 10.9784 10.3771 10.8584V4.71411L10.8113 5.14825C10.8527 5.19268 10.9026 5.22832 10.9581 5.25304C11.0135 5.27776 11.0734 5.29105 11.1341 5.29212C11.1949 5.29319 11.2552 5.28202 11.3115 5.25927C11.3678 5.23653 11.4189 5.20268 11.4619 5.15973C11.5048 5.11679 11.5387 5.06564 11.5614 5.00933C11.5842 4.95302 11.5953 4.8927 11.5943 4.83198C11.5932 4.77126 11.5799 4.71138 11.5552 4.6559C11.5305 4.60043 11.4948 4.5505 11.4504 4.5091L10.2445 3.30315C10.1597 3.21847 10.0447 3.1709 9.92489 3.1709C9.80505 3.1709 9.6901 3.21847 9.60531 3.30315L8.39936 4.5091C8.31468 4.59389 8.26711 4.70884 8.26711 4.82868C8.26711 4.94852 8.31468 5.06346 8.39936 5.14825ZM5.55333 10.973L5.98747 10.5388C6.02887 10.4944 6.0788 10.4588 6.13427 10.4341C6.18974 10.4093 6.24963 10.396 6.31035 10.395C6.37107 10.3939 6.43138 10.4051 6.4877 10.4278C6.54401 10.4506 6.59516 10.4844 6.6381 10.5274C6.68104 10.5703 6.7149 10.6215 6.73764 10.6778C6.76039 10.7341 6.77156 10.7944 6.77049 10.8551C6.76941 10.9158 6.75612 10.9757 6.73141 11.0312C6.70669 11.0867 6.67105 11.1366 6.62662 11.178L5.42067 12.3839C5.33588 12.4686 5.22094 12.5162 5.1011 12.5162C4.98126 12.5162 4.86632 12.4686 4.78152 12.3839L3.57558 11.178C3.53114 11.1366 3.49551 11.0867 3.47079 11.0312C3.44607 10.9757 3.43278 10.9158 3.43171 10.8551C3.43064 10.7944 3.44181 10.7341 3.46455 10.6778C3.4873 10.6215 3.52115 10.5703 3.5641 10.5274C3.60704 10.4844 3.65819 10.4506 3.7145 10.4278C3.77081 10.4051 3.83113 10.3939 3.89185 10.395C3.95257 10.396 4.01245 10.4093 4.06793 10.4341C4.1234 10.4588 4.17333 10.4944 4.21473 10.5388L4.64887 10.973V4.82868C4.64887 4.70874 4.69651 4.59371 4.78132 4.5089C4.86613 4.42409 4.98116 4.37645 5.1011 4.37645C5.22104 4.37645 5.33606 4.42409 5.42087 4.5089C5.50568 4.59371 5.55333 4.70874 5.55333 4.82868V10.973Z" fill="#656565"/>
                            </svg>
                        </div>
                        <div className="ItemLabel" onClick={sortByName} id='NameTag'>Item Name
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                                <path d="M8.39936 5.14825C8.48416 5.23294 8.5991 5.28051 8.71894 5.28051C8.83878 5.28051 8.95372 5.23294 9.03852 5.14825L9.47266 4.71411V10.8584C9.47266 10.9784 9.5203 11.0934 9.60511 11.1782C9.68992 11.263 9.80495 11.3106 9.92489 11.3106C10.0448 11.3106 10.1599 11.263 10.2447 11.1782C10.3295 11.0934 10.3771 10.9784 10.3771 10.8584V4.71411L10.8113 5.14825C10.8527 5.19268 10.9026 5.22832 10.9581 5.25304C11.0135 5.27776 11.0734 5.29105 11.1341 5.29212C11.1949 5.29319 11.2552 5.28202 11.3115 5.25927C11.3678 5.23653 11.4189 5.20268 11.4619 5.15973C11.5048 5.11679 11.5387 5.06564 11.5614 5.00933C11.5842 4.95302 11.5953 4.8927 11.5943 4.83198C11.5932 4.77126 11.5799 4.71138 11.5552 4.6559C11.5305 4.60043 11.4948 4.5505 11.4504 4.5091L10.2445 3.30315C10.1597 3.21847 10.0447 3.1709 9.92489 3.1709C9.80505 3.1709 9.6901 3.21847 9.60531 3.30315L8.39936 4.5091C8.31468 4.59389 8.26711 4.70884 8.26711 4.82868C8.26711 4.94852 8.31468 5.06346 8.39936 5.14825ZM5.55333 10.973L5.98747 10.5388C6.02887 10.4944 6.0788 10.4588 6.13427 10.4341C6.18974 10.4093 6.24963 10.396 6.31035 10.395C6.37107 10.3939 6.43138 10.4051 6.4877 10.4278C6.54401 10.4506 6.59516 10.4844 6.6381 10.5274C6.68104 10.5703 6.7149 10.6215 6.73764 10.6778C6.76039 10.7341 6.77156 10.7944 6.77049 10.8551C6.76941 10.9158 6.75612 10.9757 6.73141 11.0312C6.70669 11.0867 6.67105 11.1366 6.62662 11.178L5.42067 12.3839C5.33588 12.4686 5.22094 12.5162 5.1011 12.5162C4.98126 12.5162 4.86632 12.4686 4.78152 12.3839L3.57558 11.178C3.53114 11.1366 3.49551 11.0867 3.47079 11.0312C3.44607 10.9757 3.43278 10.9158 3.43171 10.8551C3.43064 10.7944 3.44181 10.7341 3.46455 10.6778C3.4873 10.6215 3.52115 10.5703 3.5641 10.5274C3.60704 10.4844 3.65819 10.4506 3.7145 10.4278C3.77081 10.4051 3.83113 10.3939 3.89185 10.395C3.95257 10.396 4.01245 10.4093 4.06793 10.4341C4.1234 10.4588 4.17333 10.4944 4.21473 10.5388L4.64887 10.973V4.82868C4.64887 4.70874 4.69651 4.59371 4.78132 4.5089C4.86613 4.42409 4.98116 4.37645 5.1011 4.37645C5.22104 4.37645 5.33606 4.42409 5.42087 4.5089C5.50568 4.59371 5.55333 4.70874 5.55333 4.82868V10.973Z" fill="#656565"/>
                            </svg>
                        </div>
                        <div className="AvaiLabel"> Status 
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                                <path d="M8.39936 5.14825C8.48416 5.23294 8.5991 5.28051 8.71894 5.28051C8.83878 5.28051 8.95372 5.23294 9.03852 5.14825L9.47266 4.71411V10.8584C9.47266 10.9784 9.5203 11.0934 9.60511 11.1782C9.68992 11.263 9.80495 11.3106 9.92489 11.3106C10.0448 11.3106 10.1599 11.263 10.2447 11.1782C10.3295 11.0934 10.3771 10.9784 10.3771 10.8584V4.71411L10.8113 5.14825C10.8527 5.19268 10.9026 5.22832 10.9581 5.25304C11.0135 5.27776 11.0734 5.29105 11.1341 5.29212C11.1949 5.29319 11.2552 5.28202 11.3115 5.25927C11.3678 5.23653 11.4189 5.20268 11.4619 5.15973C11.5048 5.11679 11.5387 5.06564 11.5614 5.00933C11.5842 4.95302 11.5953 4.8927 11.5943 4.83198C11.5932 4.77126 11.5799 4.71138 11.5552 4.6559C11.5305 4.60043 11.4948 4.5505 11.4504 4.5091L10.2445 3.30315C10.1597 3.21847 10.0447 3.1709 9.92489 3.1709C9.80505 3.1709 9.6901 3.21847 9.60531 3.30315L8.39936 4.5091C8.31468 4.59389 8.26711 4.70884 8.26711 4.82868C8.26711 4.94852 8.31468 5.06346 8.39936 5.14825ZM5.55333 10.973L5.98747 10.5388C6.02887 10.4944 6.0788 10.4588 6.13427 10.4341C6.18974 10.4093 6.24963 10.396 6.31035 10.395C6.37107 10.3939 6.43138 10.4051 6.4877 10.4278C6.54401 10.4506 6.59516 10.4844 6.6381 10.5274C6.68104 10.5703 6.7149 10.6215 6.73764 10.6778C6.76039 10.7341 6.77156 10.7944 6.77049 10.8551C6.76941 10.9158 6.75612 10.9757 6.73141 11.0312C6.70669 11.0867 6.67105 11.1366 6.62662 11.178L5.42067 12.3839C5.33588 12.4686 5.22094 12.5162 5.1011 12.5162C4.98126 12.5162 4.86632 12.4686 4.78152 12.3839L3.57558 11.178C3.53114 11.1366 3.49551 11.0867 3.47079 11.0312C3.44607 10.9757 3.43278 10.9158 3.43171 10.8551C3.43064 10.7944 3.44181 10.7341 3.46455 10.6778C3.4873 10.6215 3.52115 10.5703 3.5641 10.5274C3.60704 10.4844 3.65819 10.4506 3.7145 10.4278C3.77081 10.4051 3.83113 10.3939 3.89185 10.395C3.95257 10.396 4.01245 10.4093 4.06793 10.4341C4.1234 10.4588 4.17333 10.4944 4.21473 10.5388L4.64887 10.973V4.82868C4.64887 4.70874 4.69651 4.59371 4.78132 4.5089C4.86613 4.42409 4.98116 4.37645 5.1011 4.37645C5.22104 4.37645 5.33606 4.42409 5.42087 4.5089C5.50568 4.59371 5.55333 4.70874 5.55333 4.82868V10.973Z" fill="#656565"/>
                            </svg>
                        </div>
                        <div className="ConLabel"> Condition 
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                                <path d="M8.39936 5.14825C8.48416 5.23294 8.5991 5.28051 8.71894 5.28051C8.83878 5.28051 8.95372 5.23294 9.03852 5.14825L9.47266 4.71411V10.8584C9.47266 10.9784 9.5203 11.0934 9.60511 11.1782C9.68992 11.263 9.80495 11.3106 9.92489 11.3106C10.0448 11.3106 10.1599 11.263 10.2447 11.1782C10.3295 11.0934 10.3771 10.9784 10.3771 10.8584V4.71411L10.8113 5.14825C10.8527 5.19268 10.9026 5.22832 10.9581 5.25304C11.0135 5.27776 11.0734 5.29105 11.1341 5.29212C11.1949 5.29319 11.2552 5.28202 11.3115 5.25927C11.3678 5.23653 11.4189 5.20268 11.4619 5.15973C11.5048 5.11679 11.5387 5.06564 11.5614 5.00933C11.5842 4.95302 11.5953 4.8927 11.5943 4.83198C11.5932 4.77126 11.5799 4.71138 11.5552 4.6559C11.5305 4.60043 11.4948 4.5505 11.4504 4.5091L10.2445 3.30315C10.1597 3.21847 10.0447 3.1709 9.92489 3.1709C9.80505 3.1709 9.6901 3.21847 9.60531 3.30315L8.39936 4.5091C8.31468 4.59389 8.26711 4.70884 8.26711 4.82868C8.26711 4.94852 8.31468 5.06346 8.39936 5.14825ZM5.55333 10.973L5.98747 10.5388C6.02887 10.4944 6.0788 10.4588 6.13427 10.4341C6.18974 10.4093 6.24963 10.396 6.31035 10.395C6.37107 10.3939 6.43138 10.4051 6.4877 10.4278C6.54401 10.4506 6.59516 10.4844 6.6381 10.5274C6.68104 10.5703 6.7149 10.6215 6.73764 10.6778C6.76039 10.7341 6.77156 10.7944 6.77049 10.8551C6.76941 10.9158 6.75612 10.9757 6.73141 11.0312C6.70669 11.0867 6.67105 11.1366 6.62662 11.178L5.42067 12.3839C5.33588 12.4686 5.22094 12.5162 5.1011 12.5162C4.98126 12.5162 4.86632 12.4686 4.78152 12.3839L3.57558 11.178C3.53114 11.1366 3.49551 11.0867 3.47079 11.0312C3.44607 10.9757 3.43278 10.9158 3.43171 10.8551C3.43064 10.7944 3.44181 10.7341 3.46455 10.6778C3.4873 10.6215 3.52115 10.5703 3.5641 10.5274C3.60704 10.4844 3.65819 10.4506 3.7145 10.4278C3.77081 10.4051 3.83113 10.3939 3.89185 10.395C3.95257 10.396 4.01245 10.4093 4.06793 10.4341C4.1234 10.4588 4.17333 10.4944 4.21473 10.5388L4.64887 10.973V4.82868C4.64887 4.70874 4.69651 4.59371 4.78132 4.5089C4.86613 4.42409 4.98116 4.37645 5.1011 4.37645C5.22104 4.37645 5.33606 4.42409 5.42087 4.5089C5.50568 4.59371 5.55333 4.70874 5.55333 4.82868V10.973Z" fill="#656565"/>
                            </svg>
                        </div>
                        <div className="TagsLabel"> Tags </div>
                    </div>
                </div>
                <div className="ItemBarHolder">
                    {units
                        .slice(startIndex, startIndex + unitsPerPage)
                        .map((unit) => {
                        
                            return (<InventoryUnit
                                key={unit.id}
                                unit={unit}
                                onChange={handleCheckboxChange}
                                checked={selectedItems.some((item) => item?.id && unit?.id && item.id === unit.id)}
                            />)
                        }

                    )}
                </div>
                <div className="pagination-controls">
                    <div className="num-items">
                        <p className="view">View </p>
                        <select className="select-num" id="select-num" onChange={handleUnitsPerPageChange}>
                            <option value="15">15</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    <div className="page-selection">
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
            </div>
        </>

    );
}