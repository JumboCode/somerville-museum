'use client'
/**
 * @fileoverview Page that shows inventory overview and general statistics.
 * 
 * @file Layout.jsx
 * @date January 12th, 2025
 * @authors Entire Somerville Museum Team
 *  
 */
import localFont from "next/font/local";
import './components/Popup.css';
import "./globals.css"
import { ClerkProvider } from '@clerk/nextjs'
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar/NavigationBar';
import Filter from './components/Filter/Filter';
import { usePathname } from 'next/navigation';
import { FilterProvider } from './components/contexts/FilterContext';
import { GlobalProvider } from './components/contexts/ToggleContext';
import './inventory/inventory.css';

// export default function RootLayout({ children, currentPage }) {
//     const [isFilterVisible, setIsFilterVisible] = useState(false);
//     const pathname = usePathname();

//     // Close filter when page changes
//     useEffect(() => {
//         setIsFilterVisible(false);
//     }, [pathname]);

export default function RootLayout({ children, currentPage }) {

  const [isFilterVisible, setIsFilterVisible] = useState(false);
    const pathname = usePathname();

    // Close filter when page changes
    useEffect(() => {
        setIsFilterVisible(false);
    }, [pathname]);

    const toggleFilterVisibility = () => {
        setIsFilterVisible(prev => !prev);
    };


  return (
    <ClerkProvider
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        signInUrl="/login"
        signUpUrl="/signup"
        >
      <FilterProvider>
        <GlobalProvider>
            <html lang="en">
                <head>
                    <title>Database</title>
                    <meta name="description" content="Database for the Somerville Museum" />
                    {/* favicon svg */}
                    <link rel="icon" type="image/svg+xml" href="/sm-logo.svg" />
                    {/* favicon png as backup */}
                    <link rel="icon" type="image/png" sizes="32x32" href="/sm-logo.png" />
                </head>
                <body>
                    <div className="app-layout">
                        <Sidebar 
                            currentPage={currentPage} 
                            onFilterToggle={toggleFilterVisibility} 
                        />
                        <div className="main-content-wrapper">
                            <Filter 
                                isVisible={isFilterVisible} 
                                onClose={toggleFilterVisibility} 
                                className={isFilterVisible ? 'visible' : ''}
                            />
                            <main className={`main-content ${isFilterVisible ? 'shrink' : ''}`}>
                                {children}
                            </main>
                        </div>
                    </div>
                </body>
            </html>
            </GlobalProvider>
        </FilterProvider>
    </ClerkProvider>
  );
 }
