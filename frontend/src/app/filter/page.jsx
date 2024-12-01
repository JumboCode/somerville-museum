import React from 'react';
import Filter from '../components/Filters';
import Inventory from '../inventory/page';
import './page.css'; // Ensure styles are imported

const Page = () => {
    return (
        <div className="main-content">
            <div className="filter-section">
                <Filter />
            </div>
            <div className="inventory-section">
                <Inventory />
            </div>
        </div>
    );
};

export default Page;
