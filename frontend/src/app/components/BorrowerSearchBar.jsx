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

    useEffect(() => { 
        const fetchData = async () => {
            if (query.trim() === "") {
                updateSearchResults([]);
                return;
            }

            try {
                const response = await fetch(`/api/borrowManagement?action=searchBorrowers`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ask: query
                    }),
                });

                if (!response.ok) throw new Error("Network response was not ok");
                
                const borrowers = await response.json();
                
                // Fetch history for each borrower
                const borrowersWithHistory = await Promise.all(
                    borrowers.map(async borrower => {
                        const historyResponse = await fetch(
                            `/api/borrowManagement?action=borrowerHistory&id=${borrower.id}`
                        );
                        const history = await historyResponse.json();
                        return { ...borrower, borrowHistory: history };
                    })
                );
                
                updateSearchResults(borrowersWithHistory);
            } catch (error) {
                console.error("Search error:", error);
                updateSearchResults([]);
            }
        };

        const debounceTimer = setTimeout(fetchData, 300);
        return () => clearTimeout(debounceTimer);
    }, [query, updateSearchResults]);

    return (
        <div className="SearchbarTwo">
            <input 
                type="text" 
                placeholder="Search borrowers..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>
    );
}