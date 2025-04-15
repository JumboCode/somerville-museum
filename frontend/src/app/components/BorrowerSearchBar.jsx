/**
 * @fileoverview This file will implement the functionality for the BorrowerSearchBar,
 *               utilizing similar functionality to the inventory SearchBar
 *               
 *               NOTES: Uses a POST request on the db.js endpoint which requires
 *                      text and params as arguments, so I turned it into a JSON
 *                      object and passed the stringified object into query
 * 
 * @file BorrowerSearchBar.jsx
 * @date February 28th, 2025
 * @authors Peter Morganelli
 *  
 */

"use client";
import "./SearchBar.css";
import { useState, useEffect } from "react"; 

export default function BorrowerSearchBar({ updateSearchResults }) {
    const [query, setQuery] = useState("");

    // Fetch relevant search results when search query is changed
    useEffect(() => { 
        const fetchData = async () => {
            // Don't search if query is empty
            if (query.trim() === "") {
                updateSearchResults([]);
                return;
            }

            try {
                const response = await fetch(`../../../../api/borrowManagement`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        action: "searchBorrowers",
                        query: query
                    }),
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();
                updateSearchResults(data);  
            } catch (error) {
                console.error("Search error:", error);
                updateSearchResults([]);
            }
        };

        // Add debounce to prevent too many requests
        const debounceTimer = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [query, updateSearchResults]);

    return (
        <div className="Searchbar">
            <input 
                type="text" 
                placeholder="Search borrowers..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Escape") {
                        setQuery("");
                    }
                }}
            />
        </div>
    );
}