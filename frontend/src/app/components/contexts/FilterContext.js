import { createContext, useContext, useState, useEffect } from "react";

// Create Context
const FilterContext = createContext();

// Provider Component
export const FilterProvider = ({ children }) => {
    const [selectedFilters, setSelectedFilters] = useState({
        status: [],
        season: [],
        return_date: { start: null, end: null },
        condition: [],
        gender: [],
        color: [],
        garment_type: [],
        size: [],
        time_period: [],
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
export const useFilterContext = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilterContext must be used within a FilterProvider');
    }
    return context;
};