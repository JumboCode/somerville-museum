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
import SortIndicator from '../assets/SortIndicator';
import './inventory.css'
import { useSearchParams } from 'next/navigation.js';
import { Suspense } from 'react';
import PropTypes from 'prop-types';
import { useUser } from '@clerk/nextjs';

Inventory.propTypes = {
    isFilterVisible: PropTypes.bool.isRequired,
    toggleFilterVisibility: PropTypes.func.isRequired,
}; 

export default function InventoryWrapper(props) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Inventory {...props} />
      </Suspense>
    );
  }
  

function Inventory({ 
    isFilterVisible = false, 
    toggleFilterVisibility = () => {console.log("scuffed")} 
}) {
    const { selectedFilters, setSelectedFilters } = useFilterContext();
    const [units, setUnits] = useState([]);
    const [originalUnits, setOriginalUnits] = useState([]);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [unitsPerPage, setUnitsPerPage] = useState(15);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const searchParams = useSearchParams();
    const filter = searchParams.get('filter');
    const [filterResults, setFilterResults] = useState([]);
    const { isLoaded, user } = useUser();
    const [isApproved, setIsApproved] = useState(null);
    const [isSearchEmpty, setIsSearchEmpty] = useState(true);

    // Calculate validity for buttons based on selectedItems
    const isBorrowValid = selectedItems.length > 0 && selectedItems.some(item => 
        item.status === "Available"
    );
    
    const isReturnValid = selectedItems.length > 0 && selectedItems.some(item => 
        item.status === "Borrowed" || item.status === "Overdue" || item.status === "Missing"
    );

    // Check if permissions to view page
    useEffect(() => {
    if (isLoaded && user) {
        const approved = user.publicMetadata?.approved === true;
        setIsApproved(approved);
    }
    }, [isLoaded, user]);
    
    const [refreshTable, setRefreshTable] = useState(false);

    const [sortConfig, setSortConfig] = useState({
        key: null, // 'id', 'name', 'avail', 'con'
        direction: 'asc' // 'asc' or 'desc'
    });

    // Called any time new filters/search results are applied to update displayed units
    useEffect(() => {
        const updateResults = () => {
            if (filterResults.length === 0 && searchResults.length === 0 && isSearchEmpty) {
                setUnits(originalUnits);
                console.log("No filters or search results, showing all units");
                setTotalPages(Math.ceil(originalUnits.length / unitsPerPage));
                return;
            }

            if (filterResults.length === 0 && searchResults.length === 0 && !isSearchEmpty) {
                setUnits([]);
                console.log("No search results, showing no units");
                setTotalPages(Math.ceil(0));
                return;
            }
    
            // If both filters and search are active, show intersection
            if (filterResults.length > 0 && searchResults.length > 0) {
                const filteredUnitIds = new Set(filterResults.map(unit => unit.id));
                const intersection = searchResults.filter(item => filteredUnitIds.has(item.id));
                setUnits(intersection);
                console.log("Both filters and search active, showing intersection");
                setTotalPages(Math.ceil(intersection.length / unitsPerPage));
            }
            // If only search is active
            else if (searchResults.length > 0 && !isSearchEmpty) {
                setUnits(searchResults);
                console.log("Only search active, showing search results");
                setTotalPages(Math.ceil(searchResults.length / unitsPerPage));
            }
            // If only filters are active
            else {
                setUnits(filterResults);
                console.log("Only filters active, showing filter results");
                setTotalPages(Math.ceil(filterResults.length / unitsPerPage));
            }
    
            setCurrentPage(1); // always reset to page 1 on data change
        };
    
        updateResults();
    }, [
        searchResults.length,
        filterResults.length,
        originalUnits.length,
        unitsPerPage
      ]);
    


    const applyFilters = async (data) => {
        // console.log("Starting filter application with data:", data);
        // console.log("Current selectedFilters:", selectedFilters);
        
        if (!Array.isArray(data)) return [];
        let filteredData = [...data];
    
        // Filter by Status
        if (selectedFilters.status && selectedFilters.status.length > 0) {
            // console.log("Before status filter:", filteredData.length);
            // console.log("Filtering by status:", selectedFilters.status);
            filteredData = filteredData.filter(item => {
                // console.log("Item status:", item.status);
                return selectedFilters.status.includes(item.status);
            });
            // console.log("After status filter:", filteredData.length);
        }
    
        // Filter by Condition
        if (selectedFilters.condition && selectedFilters.condition.length > 0) {
            // console.log("Filtering by condition:", selectedFilters.condition);
            filteredData = filteredData.filter(item => 
                item.condition &&
                selectedFilters.condition.some(condition => 
                    item.condition.includes(condition)
                )
            );
        }
    
        // Filter by Gender
        if (selectedFilters.gender && selectedFilters.gender.length > 0) {
            // console.log("Filtering by gender:", selectedFilters.gender);
            filteredData = filteredData.filter(item => 
                selectedFilters.gender.includes(item.gender)
            );
        }
    
        // Filter by Color
        if (selectedFilters.color && selectedFilters.color.length > 0) {
            // console.log("Filtering by color:", selectedFilters.color);
            filteredData = filteredData.filter(item => 
                // Check if any of the selected colors exist in the item's color array
                selectedFilters.color.some(color => 
                    Array.isArray(item.color) ? item.color.includes(color) : item.color === color
                )
            );
        }
    
        // Filter by Garment Type
        if (selectedFilters.garment_type && selectedFilters.garment_type.length > 0) {
            // console.log("Filtering by garment type:", selectedFilters.garment_type);
            filteredData = filteredData.filter(item => 
                selectedFilters.garment_type.includes(item.garment_type)
            );
        }
    
        // Filter by Size
        if (selectedFilters.size && selectedFilters.size.length > 0) {
            // console.log("Filtering by size:", selectedFilters.size);
            filteredData = filteredData.filter(item => 
                selectedFilters.size.includes(item.size)
            );
        }
    
        // Filter by Season
        if (selectedFilters.season && selectedFilters.season.length > 0) {
            // console.log("Filtering by season:", selectedFilters.season);
            filteredData = filteredData.filter(item => 
                // Check if any of the selected seasons exist in the item's season array
                selectedFilters.season.some(season => 
                    Array.isArray(item.season) ? item.season.includes(season) : item.season === season
                )
            );
        }
    
        // Filter by Time Period
        if (selectedFilters.time_period && selectedFilters.time_period.length > 0) {
            // console.log("Filtering by time period:", selectedFilters.time_period);
            filteredData = filteredData.filter(item => 
                // Check if any of the selected time periods exist in the item's time_period array
                selectedFilters.time_period.some(period => 
                    Array.isArray(item.time_period) ? item.time_period.includes(period) : item.time_period === period
                )
            );
        }

        // Filter by Return Date Range
        if (selectedFilters.return_date?.start && selectedFilters.return_date?.end) {
            try {
                const response = await fetch(`/api/inventoryQueries?action=fetchByReturnDate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        startDate: selectedFilters.return_date.start,
                        endDate: selectedFilters.return_date.end
                    })
                });
                
                if (response.ok) {
                    const itemIds = await response.json();
                    console.log("Items matching date range:", itemIds);
                    
                    // Ensure itemIds is an array before filtering
                    if (Array.isArray(itemIds)) {
                        filteredData = filteredData.filter(item => 
                            itemIds.includes(item.id)
                        );
                    } else {
                        console.error("Expected array of item IDs, got:", itemIds);
                        filteredData = [];
                    }
                } else {
                    console.error("Failed to fetch by return date:", await response.text());
                }
            } catch (error) {
                console.error("Error filtering by return date:", error);
                return [];
            }
        }
    
        // console.log("Final filtered results:", filteredData);
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
                const inventoryData = Array.isArray(data) ? data : [];
                // console.log("Fetched data:", data);
                const currentDate = new Date();
                const updatedData = inventoryData.map((item) => {
                    if (item.status === "Borrowed" && item.dueDate && new Date(item.dueDate) < currentDate) {
                        return { ...item, status: "Overdue" };
                    }
                    return item;
                });
                // console.log("Processed data:", updatedData);

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
                    // Use await here since applyFilters is async
                    const filteredData = await applyFilters(updatedData);
                    setUnits(filteredData);
                    setTotalPages(Math.ceil(filteredData.length / unitsPerPage));
                } else {
                    setUnits(updatedData);
                    setTotalPages(Math.ceil(updatedData.length / unitsPerPage));
                }

            } else {
                console.error("failed to fetch data");
                setOriginalUnits([]);
                setUnits([]);
            }
        } catch (error) {
            console.error(error);
            setOriginalUnits([]);
            setUnits([]);
        }
    }

    // Initial data fetch
    useEffect(() => {
        fetchData();
    }, []);

    // manage filters if someone is navigating here from clicking one of the links
    // in the dashboard
    useEffect(() => {
        const applyFilterFromUrl = async () => {
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
                    // Use await here since applyFilters is async
                    const filteredData = await applyFilters(originalUnits);
                    setUnits(filteredData);
                    setTotalPages(Math.ceil(filteredData.length / unitsPerPage));
                }
            }
        };
        
        applyFilterFromUrl();
    }, [filter, setSelectedFilters, originalUnits, unitsPerPage]);

    // Filter effect
    useEffect(() => {
        const updateFilteredUnits = async () => {
            console.log("Filter effect triggered");
            console.log("Current originalUnits:", originalUnits);
            console.log("Current selectedFilters:", selectedFilters);
            
            // Only proceed if we have data
            if (originalUnits.length === 0) {
                console.log("No data available yet, waiting for data fetch");
                return;
            }
            
            const hasActiveFilters = Object.entries(selectedFilters).some(([key, value]) => {
                if (key === 'return_date') {
                    return value?.start && value?.end;
                }
                return Array.isArray(value) && value.length > 0;
            });
            
            if (!hasActiveFilters) {
                console.log("No filters active, showing all units");
                setUnits(originalUnits);
                setTotalPages(Math.ceil(originalUnits.length / unitsPerPage));
                return;
            }

            // Use await here since applyFilters is async
            const filteredUnits = await applyFilters(originalUnits);
            console.log("After applying filters:", filteredUnits);
            
            setUnits(filteredUnits);
            setCurrentPage(1);
            setTotalPages(Math.ceil(filteredUnits.length / unitsPerPage));
        };
        
        updateFilteredUnits();
    }, [selectedFilters, originalUnits, unitsPerPage]);

    const handleBorrowSuccess = () => {
        setFilterResults([]); 
        setSearchResults([]); 
        setSelectedItems([]); 
        fetchData(); 
    };

    const handleReturnSuccess = () => {
        // console.log("Return operation sucwcessful, refreshing inventory...");
        setRefreshTable(prev => !prev); // Refresh table to show updated status
        setSelectedItems([]); // Clear selected items
        fetchData();
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
        setSelectedItems([...units]);
        setSelectAllChecked(!selectAllChecked);
    };

    const handleDeselectAllChange = () => {
        setSelectedItems([]);
        setSelectAllChecked(!selectAllChecked);
    };

    const startIndex = (currentPage - 1) * unitsPerPage;

    const currentUnits = units
        .slice(startIndex, startIndex + unitsPerPage)
        .filter(unit => unit?.id != null)
        .map((unit, index) => {
        const absoluteIndex = startIndex + index;
            return (
                <InventoryUnit
                key={unit.id}
                unit={unit}
                index={absoluteIndex}
                unitList={units} // current page's units
                onChange={handleCheckboxChange}
                checked={selectedItems.some((item) => item?.id && unit?.id && item.id === unit.id)}
                />
            );
    });

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1); // Reset to page 1 on sort change
        
        // Call the appropriate sort function
        if (sortingFunctions[key]) {
            sortingFunctions[key](direction);
        }
    };
    
    const sortingFunctions = {
        id: (direction) => sortByID(direction),
        name: (direction) => sortByName(direction),
        avail: (direction) => sortByAvail(direction),
        con: (direction) => sortByCon(direction)
    };
    
    // Updated sort functions
    const sortByID = (direction = 'asc') => {
        setUnits(prevUnits => {
            if (!Array.isArray(prevUnits)) return [];
            const sorted = [...prevUnits].sort((a, b) => a.id - b.id);
            return direction === 'asc' ? sorted : sorted.reverse();
        });
    };
    
    const sortByName = (direction = 'asc') => {
        setUnits(prevUnits => {
            if (!Array.isArray(prevUnits)) return [];
            const sorted = [...prevUnits].sort((a, b) => a.name.localeCompare(b.name));
            return direction === 'asc' ? sorted : sorted.reverse();
        });
    };
    
    const sortByAvail = (direction = 'asc') => {
        const availability = ["Available", "Borrowed", "Overdue", "Missing"];
        setUnits(prevUnits => {
            if (!Array.isArray(prevUnits)) return [];
            const sorted = [...prevUnits].sort((a, b) => 
            availability.indexOf(a.status) - availability.indexOf(b.status)
            );
            return direction === 'asc' ? sorted : sorted.reverse();
        });
    };
    
    const sortByCon = (direction = 'asc') => {
        const order = [
            "Great",
            "Good",
            "Needs washing",
            "Needs repair",
            "Needs dry cleaning",
            "Not usable"
        ];
        
        setUnits(prevUnits => {
            if (!Array.isArray(prevUnits)) return [];
            const sorted = [...prevUnits].sort((a, b) => {
            // Handle null/undefined conditions
            if (!a.condition) return 1; // Push nulls to end
            if (!b.condition) return -1;
            
            // Function to get the highest-ranked condition for an item
            const getHighestCondition = (conditions) => 
                conditions.reduce((best, c) =>
                order.indexOf(c) < order.indexOf(best) ? c : best, conditions[0]
                );
            
            const highestA = getHighestCondition(a.condition);
            const highestB = getHighestCondition(b.condition);
            
            return order.indexOf(highestA) - order.indexOf(highestB);
            });
            return direction === 'asc' ? sorted : sorted.reverse();
        });
    };

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
        setTotalPages(Math.ceil(units.length / Number(event.target.value)));
    };

    // an array of buttons for page selection
    const buttons = Array.from({ length: totalPages || 1 }, (_, index) => index + 1);

    // Conditional rendering based on user approval
    if (!isLoaded || isApproved === null) return null;

    // If user is not approved, show an error message
    if (!isApproved) {
        return (
        <div className="dashboard-container">
            <p>You are not allowed to see this section. Please wait for approval from an administrator.</p>
        </div>
        );
    }

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
                        <SearchBar updateSearchResults={setSearchResults} updateEmptySearchBar={setIsSearchEmpty}/>
                        <div className='buttons'> 
                            <AddButton className='addBtn'> </AddButton>
                            <BorrowButton 
                                className='brwBtn'
                                selectedItems={selectedItems}
                                onSuccess={handleBorrowSuccess}
                                isValid={isBorrowValid}
                            >
                                Borrow
                            </BorrowButton>
                            <ReturnButton 
                                className='rtnBtn'
                                selectedItems={selectedItems}
                                onSuccess={handleReturnSuccess}
                                isValid={isReturnValid}
                            >
                                Return
                            </ReturnButton>
                            <DeleteItemButton
                                classname='delBtn'
                                selectedItems={selectedItems}
                                isChecked={selectedItems.length > 0}
                            >
                            </DeleteItemButton>
                        </div>
                    </div>
                    <div className="TableLabels">
                        <div className="SelectAll" id='SelectAll' onClick={handleSelectAllChange}>
                            Select All
                        </div>
                        <div className="SelectAll" id='SelectAll' onClick={handleDeselectAllChange}>
                            Deselect All
                        </div>
                        <button className="IDLabel" onClick={() => requestSort('id')} id='SortTag'>
                            Item ID 
                            <SortIndicator 
                            active={sortConfig.key === 'id'} 
                            direction={sortConfig.direction}
                            />
                        </button>
                        <button className='ItemLabel' onClick={() => requestSort('name')} id='SortTag'>
                            Item Name
                            <SortIndicator 
                            active={sortConfig.key === 'name'} 
                            direction={sortConfig.direction}
                            />
                        </button>
                        <button className="AvaiLabel" onClick={() => requestSort('avail')} id='SortTag'>
                            Status
                            <SortIndicator 
                            active={sortConfig.key === 'avail'} 
                            direction={sortConfig.direction}
                            />
                        </button>
                        <button className="ConLabel" onClick={() => requestSort('con')} id='SortTag'>
                            Condition
                            <SortIndicator 
                            active={sortConfig.key === 'con'} 
                            direction={sortConfig.direction}
                            />
                        </button>
                        <div className="TagsLabel">Item Tags</div>
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