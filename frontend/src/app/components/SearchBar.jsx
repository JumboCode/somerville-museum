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
import { useState, useEffect, useRef } from "react";

export default function SearchBar({ updateSearchResults }) {
    const [query, setQuery] = useState("");
    const isFirstRender = useRef(true);


    // Fetch relevant search results when search query is changed
    useEffect(() => {
        const trimmed = query.trim();
        if (trimmed === "") {
            updateSearchResults([]); // ensures nothing overrides filters
            return;
        }
    
        const controller = new AbortController(); // optional: cancel on unmount or rapid typing
    
        const fetchData = async () => {
            console.log("Search query:", query);
            try {
                const response = await fetch(`/api/itemManagement?action=search`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ searchQuery: query }),
                    signal: controller.signal
                });
    
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
    
                const data = await response.json();
                console.log("Search results:", data);
                updateSearchResults(data);
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.log(error);
                }
            }
        };
    
        fetchData();
    
        return () => {
            controller.abort();
        };
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