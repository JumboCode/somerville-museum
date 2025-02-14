"use client";

import "./SearchBar.css";
import { useState, useEffect } from "react"; 

export default function SearchBar({ updateSearchResults }) {
    const [query, setQuery] = useState("");

    const enterQuery = (e) => {
        setQuery(e.target.value);
    };
    // TODO: integrate w/ filters
    useEffect(() => {  // Fetch relevant search results when search query is changed
        const fetchData = async () => {
            try {
                const response = await fetch(`../../api/search`, {
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
                onChange={enterQuery}
                onKeyDown={(e) => {if (e.key == 'Backspace') {enterQuery}}}  // Added for redundancy in detecting backspace; should work w/out this
            />
        </div>
    );
}