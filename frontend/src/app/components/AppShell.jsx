'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar/NavigationBar';
import Filter from './Filter/Filter';

export default function AppShell({ children }) {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsFilterVisible(false);
  }, [pathname]);

  const toggleFilterVisibility = () => {
    setIsFilterVisible((prev) => !prev);
  };

  return (
    <div className="app-layout">
      <Sidebar
        currentPage={pathname}
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
  );
}
