/*Tabs.jsx has 5 things:
* 1. Logo (no action)
    - PNG file
* 2. Tab Button 1 (pie chart) --> bring to dashboard
    -Dashboard component
    - onClick --> bring to dashboard
    - Components:
        - Inventory Dashboard: *Need to implement* 
        - Overview: Dashboard.jsx
        - Recent Borrows: *Need to implement*
* 3. Tab Button 2 (grid) --> brings to inventory grid component
    - 
* 4. Tab Button 3  (funnel) --> pop out funnel model
    -Filters component
* 5. Settings Button (settings icon)
    -Use Feathericons.dev Settings logo (or the Figma one>)
*/

'use client';

// Sidebar.jsx
import React from 'react';
import Gear from '../assets/Gear.jsx';
import Pie from '../assets/Pie.jsx';
import Filter from '../assets/Filter.jsx';
import Brick from '../assets/Brick.jsx';
import Logo from '../assets/Logo.jsx';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidenav">
            <div className="logo-wrapper">
                <Logo />
            </div>

            {/* Static navigation items */}
            
            <div className="nav-item">
                <Pie />
            </div>
            <div className="nav-item">
                <Brick />
            </div>
            <div className="nav-item">
                <Filter />
            </div>
            

            <div className="nav-item settings">
                <Gear />
            </div>
        </div>
    );
};

export default Sidebar;