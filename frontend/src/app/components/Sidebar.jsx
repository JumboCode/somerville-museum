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

import React, { useState } from 'react';
import Gear from '../assets/Gear.jsx';
import Pie from '../assets/Pie.jsx';
import Filter from '../assets/Filter.jsx';
import Brick from '../assets/Brick.jsx';
import Logo from '../assets/Logo.jsx';
import './Sidebar.css';

// import Filter from './Filters';
import Dashboard from "./Dashboard.jsx";
import Link from 'next/link'
// import ELiTable from "./components/15Tablecomp/EliTable";

const Sidebar = () => {
    return (
        <div>
            <div className="sidenav">
                <Logo />
                {/*add functionality later!!*/}
                <Pie />
                {/* <Brick /> */}
                {/* <li> */}
                <Brick />
                    {/* <Link href="/inventory"></Link> */}
                {/* </li> */}
                <Filter />
                <Gear />
            </div>

            {/* <div className="main">
                <Dashboard />
            </div> */}
        </div>
    );
};

export default Sidebar;