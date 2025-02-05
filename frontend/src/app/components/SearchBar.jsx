"use client";

import './SearchBar.css';

export default function SearchBar() {
    return (
        <div className="Searchbar">
            <input type="text" placeholder="Search..." />
            {/* Get all response data from what is returned from filters component */}
            {/* Use substring and id identification to update what should be shown */}
        </div>
    );
}