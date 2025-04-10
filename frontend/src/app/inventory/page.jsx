"use client";

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
import { useSearchParams } from 'next/navigation.js';
import PropTypes from 'prop-types';

Inventory.propTypes = {
    isFilterVisible: PropTypes.bool.isRequired,
    toggleFilterVisibility: PropTypes.func.isRequired,
}; 

export default function Inventory({ 
    isFilterVisible = false, 
    toggleFilterVisibility = () => {console.log("scuffed")} 
}) {
    const { selectedFilters, setSelectedFilters } = useFilterContext();
    const [units, setUnits] = useState([]);
    const [originalUnits, setOriginalUnits] = useState([]);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [unitsPerPage, setUnitsPerPage] = useState(15);
    const [totalPages, setTotalPages] = useState();
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const searchParams = useSearchParams();
    const filter = searchParams.get('filter');
    const [filterResults, setFilterResults] = useState([]);
    
    const [refreshTable, setRefreshTable] = useState(false);
    const [sortType, setSortType] = useState('id'); // Track last sorted property
    const [isSorted, setIsSorted] = useState(false); // Track if already sorted

    // const sortBy = (property) => {
    //     console.log("calling sortBy")
    //     if (sortType === property && isSorted) {
    //         // Reset to ID sorting
    //         setSortType('id');
    //         setIsSorted(false);
    //         sortingFunctions.id(); // Always sorts by ID when reset

    //     } else {
    //         // Sort based on the selected property
    //         setSortType(property);
    //         setIsSorted(true);

    //         sortingFunctions[property]();
    //         console.log(sortingFunctions[property]);
    //     }
    // };

    // const sortingFunctions = {
    //     id: () => sortByID(),
    //     con: () => sortByCon(),
    //     avail: () => sortByAvail(),
    //     name: () => sortByName()
    // };

    // Called any time new filters/search results are applied to update displayed units
    useEffect(() => {
        console.log(filterResults.length)
        console.log(searchResults.length)
        if (filterResults.length === 0 && searchResults.length === 0) return;
        // Takes intersection of search results and filter results to get correct ones.
        const filteredAndSearchResults = () => {
            const filteredUnitIds = new Set(filterResults.map(unit => unit.id));
            return searchResults.length > 0 
            ? searchResults.filter(item => filteredUnitIds.has(item.id)) 
            : filterResults;
        }});


    const applyFilters = (data) => {
        console.log("Starting filter application with data:", data);
        console.log("Current selectedFilters:", selectedFilters);
        
        let filteredData = [...data];
    
        // Filter by Status
        if (selectedFilters.status && selectedFilters.status.length > 0) {
            console.log("Before status filter:", filteredData.length);
            console.log("Filtering by status:", selectedFilters.status);
            filteredData = filteredData.filter(item => {
                console.log("Item status:", item.status);
                return selectedFilters.status.includes(item.status);
            });
            console.log("After status filter:", filteredData.length);
        }
    
        // Filter by Condition
        if (selectedFilters.condition && selectedFilters.condition.length > 0) {
            console.log("Filtering by condition:", selectedFilters.condition);
            filteredData = filteredData.filter(item => 
                selectedFilters.condition.some(condition => 
                    item.condition.includes(condition)
                )
            );
        }
    
        // Filter by Gender
        if (selectedFilters.gender && selectedFilters.gender.length > 0) {
            console.log("Filtering by gender:", selectedFilters.gender);
            filteredData = filteredData.filter(item => 
                selectedFilters.gender.includes(item.gender)
            );
        }
    
        // Filter by Color
        if (selectedFilters.color && selectedFilters.color.length > 0) {
            console.log("Filtering by color:", selectedFilters.color);
            filteredData = filteredData.filter(item => 
                // Check if any of the selected colors exist in the item's color array
                selectedFilters.color.some(color => 
                    Array.isArray(item.color) ? item.color.includes(color) : item.color === color
                )
            );
        }
    
        // Filter by Garment Type
        if (selectedFilters.garment_type && selectedFilters.garment_type.length > 0) {
            console.log("Filtering by garment type:", selectedFilters.garment_type);
            filteredData = filteredData.filter(item => 
                selectedFilters.garment_type.includes(item.garment_type)
            );
        }
    
        // Filter by Size
        if (selectedFilters.size && selectedFilters.size.length > 0) {
            console.log("Filtering by size:", selectedFilters.size);
            filteredData = filteredData.filter(item => 
                selectedFilters.size.includes(item.size)
            );
        }
    
        // Filter by Season
        if (selectedFilters.season && selectedFilters.season.length > 0) {
            console.log("Filtering by season:", selectedFilters.season);
            filteredData = filteredData.filter(item => 
                // Check if any of the selected seasons exist in the item's season array
                selectedFilters.season.some(season => 
                    Array.isArray(item.season) ? item.season.includes(season) : item.season === season
                )
            );
        }
    
        // Filter by Time Period
        if (selectedFilters.time_period && selectedFilters.time_period.length > 0) {
            console.log("Filtering by time period:", selectedFilters.time_period);
            filteredData = filteredData.filter(item => 
                // Check if any of the selected time periods exist in the item's time_period array
                selectedFilters.time_period.some(period => 
                    Array.isArray(item.time_period) ? item.time_period.includes(period) : item.time_period === period
                )
            );
        }
    
        // Filter by Return Date Range
        if (selectedFilters.return_date && selectedFilters.return_date.start && selectedFilters.return_date.end) {
            console.log("Filtering by return date range:", selectedFilters.return_date);
            filteredData = filteredData.filter(item => {
                if (!item.return_date) return false;
                const returnDate = new Date(item.return_date);
                const startDate = new Date(selectedFilters.return_date.start);
                const endDate = new Date(selectedFilters.return_date.end);
                return returnDate >= startDate && returnDate <= endDate;
            });
        }
    
        console.log("Final filtered results:", filteredData);
        return filteredData;
    };

    async function fetchData() {
        try {
            const response = await fetch(`../../api/db`, { 
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                  text: 'SELECT * from dummy_data ORDER BY id'
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Fetched data:", data);
                const currentDate = new Date();
                const updatedData = data.map((item) => {
                    if (item.status === "Borrowed" && item.dueDate && new Date(item.dueDate) < currentDate) {
                        return { ...item, status: "Overdue" };
                    }
                    return item;
                });
                console.log("Processed data:", updatedData);

                setOriginalUnits(updatedData);
                setUnits(updatedData);
                setTotalPages(Math.ceil(updatedData.length / unitsPerPage));

                if (selectedFilters.status?.length > 0 || 
                    selectedFilters.condition?.length > 0 ||
                    selectedFilters.gender?.length > 0 ||
                    selectedFilters.color?.length > 0 ||
                    selectedFilters.garment_type?.length > 0 ||
                    selectedFilters.size?.length > 0 ||
                    selectedFilters.season?.length > 0 ||
                    selectedFilters.time_period?.length > 0 ||
                    (selectedFilters.return_date?.start && selectedFilters.return_date?.end)) {
                    const filteredData = applyFilters(updatedData);
                    setUnits(filteredData);
                    setTotalPages(Math.ceil(filteredData.length / unitsPerPage));
                } else {
                    setUnits(updatedData);
                    setTotalPages(Math.ceil(updatedData.length / unitsPerPage));
                }

            } else {
                console.error("failed to fetch data");
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Initial data fetch
    useEffect(() => {
        fetchData();
    }, []);

    // manage filters if someone is navigating here from clicking one of the links
    // in the dashboard
    useEffect(() => {
        if (filter) {
            console.log("Setting filter from URL:", filter);
            const newFilters = {
                condition: [],
                gender: [],
                color: [],
                garment_type: [],
                size: [],
                time_period: [],
                status: [filter],
                season: [],
                return_date: { start: null, end: null }
            };
            setSelectedFilters(newFilters);
            
            // If we already have data, apply the filter immediately
            if (originalUnits.length > 0) {
                const filteredData = applyFilters(originalUnits);
                setUnits(filteredData);
                setTotalPages(Math.ceil(filteredData.length / unitsPerPage));
            }
        }
    }, [filter, setSelectedFilters, originalUnits]);

    // Filter effect
    useEffect(() => {
        console.log("Filter effect triggered");
        console.log("Current originalUnits:", originalUnits);
        console.log("Current selectedFilters:", selectedFilters);
        
        // Only proceed if we have data
        if (originalUnits.length === 0) {
            console.log("No data available yet, waiting for data fetch");
            return;
        }
        
        if (Object.values(selectedFilters).every(val => 
            Array.isArray(val) ? val.length === 0 : !val
        )) {
            console.log("No filters active, showing all units");
            setUnits(originalUnits);
            return;
        }

        const filteredUnits = applyFilters(originalUnits);
        console.log("After applying filters:", filteredUnits);
        
        setUnits(filteredUnits);
        setCurrentPage(1);
        setTotalPages(Math.ceil(filteredUnits.length / unitsPerPage));
    }, [selectedFilters, originalUnits]);


    const handleBorrowSuccess = () => {
        // Literally just to call the useeffect with the request. kinda scuffed but whatever
        // setRefreshTable(prev => !prev);

        setFilterResults([]); 
        setSearchResults([]); 
        setSelectedItems([]); 
        fetchData(); 

    };
  

    const handleReturnSuccess = () => {
        console.log("Return operation successful, refreshing inventory...");
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

    const sortByID = () => {
        if(!isSorted) {
            const filteredAndSortedEntries = [...units]
                .sort((a, b) => a.id - b.id); // Sort by id

            setIsSorted(true);
            setUnits(filteredAndSortedEntries);
        } else {
            const filteredAndSortedEntries = [...units]
                .sort((b, a) => a.id - b.id); // Sort by id

            setIsSorted(false);
            setUnits(filteredAndSortedEntries);
        }
    };

    const sortByName = () => {
        if(!isSorted) {
            const filteredAndSortedEntries = [...units]
                .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

            setIsSorted(true);
            setUnits(filteredAndSortedEntries);
        } else {
            const filteredAndSortedEntries = [...units]
                .sort((b, a) => a.name.localeCompare(b.name)); // Sort alphabetically

            setIsSorted(false);
            setUnits(filteredAndSortedEntries);
        }
    };

    const sortByAvail = () => {
        const availability = [
            "Available",
            "Borrowed",
            "Overdue",
            "Missing"
        ];

        if(!isSorted) {
            const filteredAndSortedEntries = [...units]
                .sort((a, b) => availability.indexOf(a.status) - availability.indexOf(b.status)); // Sort by availability

            setIsSorted(true);
            setUnits(filteredAndSortedEntries);
        } else {
            const filteredAndSortedEntries = [...units]
                .sort((b, a) => availability.indexOf(a.status) - availability.indexOf(b.status)); // Sort by availability

            setIsSorted(false);
            setUnits(filteredAndSortedEntries);
        }
    };

    const sortByCon = () => {
        const order = [
            "Great",
            "Good",
            "Needs washing",
            "Needs repair",
            "Needs dry cleaning",
            "Not usable"
        ];
    
        if(!isSorted) {
            const filteredAndSortedEntries = [...units].sort((a, b) => {
                // Function to get the highest-ranked condition for an item
                const getHighestCondition = (conditions) => 
                    conditions.reduce((best, c) =>
                        order.indexOf(c) < order.indexOf(best) ? c : best, conditions[0]
                    );
        
                const highestA = getHighestCondition(a.condition);
                const highestB = getHighestCondition(b.condition);
        
                return order.indexOf(highestA) - order.indexOf(highestB);
            });
        
            setIsSorted(true);
            setUnits(filteredAndSortedEntries);
        } else {
            const filteredAndSortedEntries = [...units].sort((a, b) => {
                // Function to get the highest-ranked condition for an item
                const getHighestCondition = (conditions) => 
                    conditions.reduce((best, c) =>
                        order.indexOf(c) < order.indexOf(best) ? c : best, conditions[0]
                    );
        
                const highestA = getHighestCondition(a.condition);
                const highestB = getHighestCondition(b.condition);
        
                return order.indexOf(highestB) - order.indexOf(highestA);
            });
        
            setIsSorted(false);
            setUnits(filteredAndSortedEntries);
        }
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
                        <div className="SelectAll" id='SelectAll' onClick={handleSelectAllChange}>Select All
                        </div>
                        <button className="IDLabel" onClick={sortByID} id='SortTag'>ID 
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                                <path d="M8.39936 5.14825C8.48416 5.23294 8.5991 5.28051 8.71894 5.28051C8.83878 5.28051 8.95372 5.23294 9.03852 5.14825L9.47266 4.71411V10.8584C9.47266 10.9784 9.5203 11.0934 9.60511 11.1782C9.68992 11.263 9.80495 11.3106 9.92489 11.3106C10.0448 11.3106 10.1599 11.263 10.2447 11.1782C10.3295 11.0934 10.3771 10.9784 10.3771 10.8584V4.71411L10.8113 5.14825C10.8527 5.19268 10.9026 5.22832 10.9581 5.25304C11.0135 5.27776 11.0734 5.29105 11.1341 5.29212C11.1949 5.29319 11.2552 5.28202 11.3115 5.25927C11.3678 5.23653 11.4189 5.20268 11.4619 5.15973C11.5048 5.11679 11.5387 5.06564 11.5614 5.00933C11.5842 4.95302 11.5953 4.8927 11.5943 4.83198C11.5932 4.77126 11.5799 4.71138 11.5552 4.6559C11.5305 4.60043 11.4948 4.5505 11.4504 4.5091L10.2445 3.30315C10.1597 3.21847 10.0447 3.1709 9.92489 3.1709C9.80505 3.1709 9.6901 3.21847 9.60531 3.30315L8.39936 4.5091C8.31468 4.59389 8.26711 4.70884 8.26711 4.82868C8.26711 4.94852 8.31468 5.06346 8.39936 5.14825ZM5.55333 10.973L5.98747 10.5388C6.02887 10.4944 6.0788 10.4588 6.13427 10.4341C6.18974 10.4093 6.24963 10.396 6.31035 10.395C6.37107 10.3939 6.43138 10.4051 6.4877 10.4278C6.54401 10.4506 6.59516 10.4844 6.6381 10.5274C6.68104 10.5703 6.7149 10.6215 6.73764 10.6778C6.76039 10.7341 6.77156 10.7944 6.77049 10.8551C6.76941 10.9158 6.75612 10.9757 6.73141 11.0312C6.70669 11.0867 6.67105 11.1366 6.62662 11.178L5.42067 12.3839C5.33588 12.4686 5.22094 12.5162 5.1011 12.5162C4.98126 12.5162 4.86632 12.4686 4.78152 12.3839L3.57558 11.178C3.53114 11.1366 3.49551 11.0867 3.47079 11.0312C3.44607 10.9757 3.43278 10.9158 3.43171 10.8551C3.43064 10.7944 3.44181 10.7341 3.46455 10.6778C3.4873 10.6215 3.52115 10.5703 3.5641 10.5274C3.60704 10.4844 3.65819 10.4506 3.7145 10.4278C3.77081 10.4051 3.83113 10.3939 3.89185 10.395C3.95257 10.396 4.01245 10.4093 4.06793 10.4341C4.1234 10.4588 4.17333 10.4944 4.21473 10.5388L4.64887 10.973V4.82868C4.64887 4.70874 4.69651 4.59371 4.78132 4.5089C4.86613 4.42409 4.98116 4.37645 5.1011 4.37645C5.22104 4.37645 5.33606 4.42409 5.42087 4.5089C5.50568 4.59371 5.55333 4.70874 5.55333 4.82868V10.973Z" fill="#656565"/>
                            </svg>
                        </button>
                        <button className='ItemLabel' onClick={sortByName} id='SortTag'>Item Name
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                                <path d="M8.39936 5.14825C8.48416 5.23294 8.5991 5.28051 8.71894 5.28051C8.83878 5.28051 8.95372 5.23294 9.03852 5.14825L9.47266 4.71411V10.8584C9.47266 10.9784 9.5203 11.0934 9.60511 11.1782C9.68992 11.263 9.80495 11.3106 9.92489 11.3106C10.0448 11.3106 10.1599 11.263 10.2447 11.1782C10.3295 11.0934 10.3771 10.9784 10.3771 10.8584V4.71411L10.8113 5.14825C10.8527 5.19268 10.9026 5.22832 10.9581 5.25304C11.0135 5.27776 11.0734 5.29105 11.1341 5.29212C11.1949 5.29319 11.2552 5.28202 11.3115 5.25927C11.3678 5.23653 11.4189 5.20268 11.4619 5.15973C11.5048 5.11679 11.5387 5.06564 11.5614 5.00933C11.5842 4.95302 11.5953 4.8927 11.5943 4.83198C11.5932 4.77126 11.5799 4.71138 11.5552 4.6559C11.5305 4.60043 11.4948 4.5505 11.4504 4.5091L10.2445 3.30315C10.1597 3.21847 10.0447 3.1709 9.92489 3.1709C9.80505 3.1709 9.6901 3.21847 9.60531 3.30315L8.39936 4.5091C8.31468 4.59389 8.26711 4.70884 8.26711 4.82868C8.26711 4.94852 8.31468 5.06346 8.39936 5.14825ZM5.55333 10.973L5.98747 10.5388C6.02887 10.4944 6.0788 10.4588 6.13427 10.4341C6.18974 10.4093 6.24963 10.396 6.31035 10.395C6.37107 10.3939 6.43138 10.4051 6.4877 10.4278C6.54401 10.4506 6.59516 10.4844 6.6381 10.5274C6.68104 10.5703 6.7149 10.6215 6.73764 10.6778C6.76039 10.7341 6.77156 10.7944 6.77049 10.8551C6.76941 10.9158 6.75612 10.9757 6.73141 11.0312C6.70669 11.0867 6.67105 11.1366 6.62662 11.178L5.42067 12.3839C5.33588 12.4686 5.22094 12.5162 5.1011 12.5162C4.98126 12.5162 4.86632 12.4686 4.78152 12.3839L3.57558 11.178C3.53114 11.1366 3.49551 11.0867 3.47079 11.0312C3.44607 10.9757 3.43278 10.9158 3.43171 10.8551C3.43064 10.7944 3.44181 10.7341 3.46455 10.6778C3.4873 10.6215 3.52115 10.5703 3.5641 10.5274C3.60704 10.4844 3.65819 10.4506 3.7145 10.4278C3.77081 10.4051 3.83113 10.3939 3.89185 10.395C3.95257 10.396 4.01245 10.4093 4.06793 10.4341C4.1234 10.4588 4.17333 10.4944 4.21473 10.5388L4.64887 10.973V4.82868C4.64887 4.70874 4.69651 4.59371 4.78132 4.5089C4.86613 4.42409 4.98116 4.37645 5.1011 4.37645C5.22104 4.37645 5.33606 4.42409 5.42087 4.5089C5.50568 4.59371 5.55333 4.70874 5.55333 4.82868V10.973Z" fill="#656565"/>
                            </svg>
                        </button>
                        <button className="AvaiLabel" onClick={sortByAvail} id='SortTag'>Status 
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                                <path d="M8.39936 5.14825C8.48416 5.23294 8.5991 5.28051 8.71894 5.28051C8.83878 5.28051 8.95372 5.23294 9.03852 5.14825L9.47266 4.71411V10.8584C9.47266 10.9784 9.5203 11.0934 9.60511 11.1782C9.68992 11.263 9.80495 11.3106 9.92489 11.3106C10.0448 11.3106 10.1599 11.263 10.2447 11.1782C10.3295 11.0934 10.3771 10.9784 10.3771 10.8584V4.71411L10.8113 5.14825C10.8527 5.19268 10.9026 5.22832 10.9581 5.25304C11.0135 5.27776 11.0734 5.29105 11.1341 5.29212C11.1949 5.29319 11.2552 5.28202 11.3115 5.25927C11.3678 5.23653 11.4189 5.20268 11.4619 5.15973C11.5048 5.11679 11.5387 5.06564 11.5614 5.00933C11.5842 4.95302 11.5953 4.8927 11.5943 4.83198C11.5932 4.77126 11.5799 4.71138 11.5552 4.6559C11.5305 4.60043 11.4948 4.5505 11.4504 4.5091L10.2445 3.30315C10.1597 3.21847 10.0447 3.1709 9.92489 3.1709C9.80505 3.1709 9.6901 3.21847 9.60531 3.30315L8.39936 4.5091C8.31468 4.59389 8.26711 4.70884 8.26711 4.82868C8.26711 4.94852 8.31468 5.06346 8.39936 5.14825ZM5.55333 10.973L5.98747 10.5388C6.02887 10.4944 6.0788 10.4588 6.13427 10.4341C6.18974 10.4093 6.24963 10.396 6.31035 10.395C6.37107 10.3939 6.43138 10.4051 6.4877 10.4278C6.54401 10.4506 6.59516 10.4844 6.6381 10.5274C6.68104 10.5703 6.7149 10.6215 6.73764 10.6778C6.76039 10.7341 6.77156 10.7944 6.77049 10.8551C6.76941 10.9158 6.75612 10.9757 6.73141 11.0312C6.70669 11.0867 6.67105 11.1366 6.62662 11.178L5.42067 12.3839C5.33588 12.4686 5.22094 12.5162 5.1011 12.5162C4.98126 12.5162 4.86632 12.4686 4.78152 12.3839L3.57558 11.178C3.53114 11.1366 3.49551 11.0867 3.47079 11.0312C3.44607 10.9757 3.43278 10.9158 3.43171 10.8551C3.43064 10.7944 3.44181 10.7341 3.46455 10.6778C3.4873 10.6215 3.52115 10.5703 3.5641 10.5274C3.60704 10.4844 3.65819 10.4506 3.7145 10.4278C3.77081 10.4051 3.83113 10.3939 3.89185 10.395C3.95257 10.396 4.01245 10.4093 4.06793 10.4341C4.1234 10.4588 4.17333 10.4944 4.21473 10.5388L4.64887 10.973V4.82868C4.64887 4.70874 4.69651 4.59371 4.78132 4.5089C4.86613 4.42409 4.98116 4.37645 5.1011 4.37645C5.22104 4.37645 5.33606 4.42409 5.42087 4.5089C5.50568 4.59371 5.55333 4.70874 5.55333 4.82868V10.973Z" fill="#656565"/>
                            </svg>
                        </button>
                        <button className="ConLabel" onClick={sortByCon} id='SortTag'>Condition 
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="16" viewBox="0 0 15 16" fill="none">
                                <path d="M8.39936 5.14825C8.48416 5.23294 8.5991 5.28051 8.71894 5.28051C8.83878 5.28051 8.95372 5.23294 9.03852 5.14825L9.47266 4.71411V10.8584C9.47266 10.9784 9.5203 11.0934 9.60511 11.1782C9.68992 11.263 9.80495 11.3106 9.92489 11.3106C10.0448 11.3106 10.1599 11.263 10.2447 11.1782C10.3295 11.0934 10.3771 10.9784 10.3771 10.8584V4.71411L10.8113 5.14825C10.8527 5.19268 10.9026 5.22832 10.9581 5.25304C11.0135 5.27776 11.0734 5.29105 11.1341 5.29212C11.1949 5.29319 11.2552 5.28202 11.3115 5.25927C11.3678 5.23653 11.4189 5.20268 11.4619 5.15973C11.5048 5.11679 11.5387 5.06564 11.5614 5.00933C11.5842 4.95302 11.5953 4.8927 11.5943 4.83198C11.5932 4.77126 11.5799 4.71138 11.5552 4.6559C11.5305 4.60043 11.4948 4.5505 11.4504 4.5091L10.2445 3.30315C10.1597 3.21847 10.0447 3.1709 9.92489 3.1709C9.80505 3.1709 9.6901 3.21847 9.60531 3.30315L8.39936 4.5091C8.31468 4.59389 8.26711 4.70884 8.26711 4.82868C8.26711 4.94852 8.31468 5.06346 8.39936 5.14825ZM5.55333 10.973L5.98747 10.5388C6.02887 10.4944 6.0788 10.4588 6.13427 10.4341C6.18974 10.4093 6.24963 10.396 6.31035 10.395C6.37107 10.3939 6.43138 10.4051 6.4877 10.4278C6.54401 10.4506 6.59516 10.4844 6.6381 10.5274C6.68104 10.5703 6.7149 10.6215 6.73764 10.6778C6.76039 10.7341 6.77156 10.7944 6.77049 10.8551C6.76941 10.9158 6.75612 10.9757 6.73141 11.0312C6.70669 11.0867 6.67105 11.1366 6.62662 11.178L5.42067 12.3839C5.33588 12.4686 5.22094 12.5162 5.1011 12.5162C4.98126 12.5162 4.86632 12.4686 4.78152 12.3839L3.57558 11.178C3.53114 11.1366 3.49551 11.0867 3.47079 11.0312C3.44607 10.9757 3.43278 10.9158 3.43171 10.8551C3.43064 10.7944 3.44181 10.7341 3.46455 10.6778C3.4873 10.6215 3.52115 10.5703 3.5641 10.5274C3.60704 10.4844 3.65819 10.4506 3.7145 10.4278C3.77081 10.4051 3.83113 10.3939 3.89185 10.395C3.95257 10.396 4.01245 10.4093 4.06793 10.4341C4.1234 10.4588 4.17333 10.4944 4.21473 10.5388L4.64887 10.973V4.82868C4.64887 4.70874 4.69651 4.59371 4.78132 4.5089C4.86613 4.42409 4.98116 4.37645 5.1011 4.37645C5.22104 4.37645 5.33606 4.42409 5.42087 4.5089C5.50568 4.59371 5.55333 4.70874 5.55333 4.82868V10.973Z" fill="#656565"/>
                            </svg>
                        </button>
                        <div className="TagsLabel"> Tags </div>
                    </div>
                </div>

                <div className="ItemBarHolder">
                    {currentUnits}
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