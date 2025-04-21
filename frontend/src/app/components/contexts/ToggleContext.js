import React, { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

// Create a Provider component
export const GlobalProvider = ({ children }) => {
    const [isToggleEnabled, setIsToggleEnabled] = useState(false);
    const [isFiltersHidden, setIsFiltersHidden] = useState(false);

    return (
        <GlobalContext.Provider value={{ isToggleEnabled, setIsToggleEnabled, isFiltersHidden, setIsFiltersHidden }}>
            {children}
        </GlobalContext.Provider>
    );
};

// Custom hook to use the GlobalContext
export const useGlobalContext = () => {
    return useContext(GlobalContext);
};