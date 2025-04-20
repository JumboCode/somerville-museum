'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NavigationItem from './NavigationItem';
import Gear from '../../assets/Gear.jsx';
import Pie from '../../assets/Pie.jsx';
import Filter from '../../assets/Filter.jsx';
import Brick from '../../assets/Brick.jsx';
import Logo from '../../assets/Logo.jsx';
import styles from './NavBar.module.css';
import User from "../../assets/User.jsx";
import { useGlobalContext } from '../contexts/ToggleContext';

const initialNavigationItems = [
  { id: 'dashboard', icon: Pie, label: 'Dashboard', href: '/dashboard' },
  { id: 'inventory', icon: Brick, label: 'Inventory', href: '/inventory' },
  { id: 'settings', icon: Gear, label: '', isSettings: true, href: '/settings' },
  { id: 'borrowers', icon: User, label: 'Borrowers', href: '/borrowers' },
];

const NavigationBar = ({ onFilterToggle }) => {
  const pathname = usePathname();
  const [navigationItems, setNavigationItems] = useState(initialNavigationItems);
  const [isMounted, setIsMounted] = useState(false);
  const { isFiltersHidden } = useGlobalContext(); // TOGGLE FILTERS 

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; 
  }

  const handleItemClick = (clickedId) => {
    if (pathname !== '/inventory') return;

    if (clickedId === 'filter') {
      onFilterToggle(); // Call the prop to toggle the filter visibility
    }
  };

  const filteredNavigationItems = () => {
    const items = [...navigationItems];
    // Conditionally add the Filter item below Inventory and above Settings
    if (pathname === '/inventory' && !isFiltersHidden) {
      const filterItem = {
        id: 'filter',
        icon: Filter,
        label: 'Filter',
      };
   
      const settingsIndex = items.findIndex(item => item.isSettings);
      if (settingsIndex !== -1) {
        items.splice(settingsIndex, 0, filterItem);
      } else {
        items.push(filterItem);
      }
    }
    return items;
  };

  return (
    <div className={styles.navigationBar}>
      <div className={styles.logo}>
        <Logo />
      </div>
      
      {filteredNavigationItems().map((item) => (
        <NavigationItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          isSettings={item.isSettings}
          onClick={() => handleItemClick(item.id)}
          href={item.href}
        />
      ))}
    </div>
  );
};

export default NavigationBar;