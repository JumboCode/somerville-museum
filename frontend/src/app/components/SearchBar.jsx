/**
 * @fileoverview Component containing the logic and design of the search bar 
 * used to filter results based on name, notes, id, or borrower name.
 * 
 * @file SearchBar.jsx
 * @date February 16th, 2025
 * @authors Peter Morganelli & Shayne Sidman 
 *  
 */

"use client";

import "./SearchBar.css";
import { useState, useEffect } from "react"; 

export default function SearchBar({ updateSearchResults }) {
    const [query, setQuery] = useState("");

    // Fetch relevant search results when search query is changed
    useEffect(() => { 
        console.log(query)
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/itemManagement?action=search`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ searchQuery: query }),
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();
                console.log(data)
                updateSearchResults(data);  // Update results on inventory page
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [query]);

    return (
        <div className="Searchbar">
            <input 
                type="text" 
                placeholder="Search..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); }}
                onKeyDown={(e) => {
                    if (e.key === "Backspace" || e.key === "Delete") {
                        setQuery(e.target.value);
                    }
                }}
            />

        </div>
    );
}