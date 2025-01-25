'use client';

import React, { useState } from 'react';
import NavigationItem from './NavigationItem';
import Gear from '../../assets/Gear.jsx';
import Pie from '../../assets/Pie.jsx';
import Filter from '../../assets/Filter.jsx';
import Brick from '../../assets/Brick.jsx';
import Logo from '../../assets/Logo.jsx';
import styles from './NavBar.module.css';

const initialNavigationItems = [
  { id: 'dashboard', icon: Pie, label: 'Dashboard' },
  { id: 'inventory', icon: Brick, label: 'Inventory' },
  { id: 'filter', icon: Filter, label: 'Filter' },
  { id: 'settings', icon: Gear, label: '', isSettings: true },
];

const NavigationBar = () => {
    const [navigationItems, setNavigationItems] = useState(initialNavigationItems);
  
    const handleItemClick = (clickedId) => {
      setNavigationItems((items) =>
        items.map((item) => ({
          ...item,
        }))
      );
    };
  
    return (
      <div className={styles.navigationBar}>
        <div className={styles.logo}>
          <Logo />
        </div>
        
        {navigationItems.map((item) => (
          <NavigationItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isSettings={item.isSettings}
            onClick={() => handleItemClick(item.id)}
          />
        ))}
      </div>
    );
  };

export default NavigationBar;