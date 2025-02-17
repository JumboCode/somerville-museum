import { createContext, useContext, useState, useEffect } from "react";

// Create Context
const FilterContext = createContext();

// Provider Component
export const FilterProvider = ({ children }) => {
    const [selectedFilters, setSelectedFilters] = useState(
    {
        status: "NOT NULL",
        season: "NOT NULL",
        return_date: "NOT NULL",
        condition: "NOT NULL",
        gender: "NOT NULL",
        color: "NOT NULL",
        type: "NOT NULL",
        size: "NOT NULL",
        time_period: "NOT NULL",
    });
    const [triggerFilteredFetch, setTriggerFilteredFetch] = useState(false);
    useEffect(() => {
        setTriggerFilteredFetch(!triggerFilteredFetch);
    }, [selectedFilters]);
    return (
        <FilterContext.Provider value={{ selectedFilters, setSelectedFilters, triggerFilteredFetch, setTriggerFilteredFetch }}>
            {children}
        </FilterContext.Provider>
    );
};

// Custom Hook for easy access
export const useFilterContext = () => useContext(FilterContext);