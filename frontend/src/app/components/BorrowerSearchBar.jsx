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
        console.log(query)
        const fetchData = async () => {
            try {
                const response = await fetch(`../../../../api/db`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    //use parameterized query to prevent sql injection :p
                    body: JSON.stringify({
                        text: `SELECT * FROM borrowers
                               WHERE id::text ILIKE $1
                               OR name ILIKE $1
                               OR email ILIKE $1
                               OR phone_number ILIKE $1
                               OR borrow_history::text ILIKE $1`,
                        params: [`%${query}%`],
                      }),
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();
                // Update results on inventory page
                updateSearchResults(data);  
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [query]);
    return (
        <div className="SearchbarTwo">
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
