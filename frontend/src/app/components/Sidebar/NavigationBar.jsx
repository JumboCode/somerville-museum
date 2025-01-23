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
  { id: 'dashboard', icon: 'ti-ti-chart-pie', label: 'Dashboard', isActive: true },
  { id: 'inventory', icon: 'ti-ti-box', label: 'Inventory', isActive: false },
  { id: 'filter', icon: 'ti-ti-filter', label: 'Filter', isActive: false },
  { id: 'settings', icon: 'ti-ti-settings', label: 'Settings', isActive: false, isSettings: true },
];

const NavigationBar = () => {
    const [navigationItems, setNavigationItems] = useState(initialNavigationItems);
  
    const handleItemClick = (clickedId) => {
      setNavigationItems((items) =>
        items.map((item) => ({
          ...item,
          isActive: item.id === clickedId,
        }))
      );
    };
  
    return (
      <>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
        />
        <nav className={styles.navigationBar} aria-label="Main navigation">
        <div className={styles.logo}>
            <Logo />
        </div>
          {navigationItems.map((item) => (
            <NavigationItem
              key={item.id}
              icon={item.icon === 'ti-ti-chart-pie' ? Pie : item.icon === 'ti-ti-box' ? Brick : item.icon === 'ti-ti-filter' ? Filter : Gear}
              label={item.label}
              isActive={item.isActive}
              isSettings={item.isSettings}
              onClick={() => handleItemClick(item.id)}
            />
          ))}
        </nav>
      </>
    );
  };

export default NavigationBar;