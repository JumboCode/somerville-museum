"use client";

import "./BorrowPopupSearchBar.css";
import { useState, useEffect } from "react"; 

export default function BorrowPopupSearchBar({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (query.trim() === "") {
        setResults([]);
        return;
      }

      try {
        const response = await fetch(`/api/db`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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

        const data = await response.json();
        setResults(data || []);
      } catch (err) {
        console.error(err);
        setResults([]);
      }
    };

    const delayDebounce = setTimeout(fetchData, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="searchbar-container">
      <input
        type="text"
        placeholder="Search for borrowers"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="searchbar-input"
      />
      {results.length > 0 && (
        <ul className="searchbar-dropdown">
          {results.map((borrower) => {
            const [firstName = "", lastName = ""] = borrower.name.split(" ");
            return (
              <div className="borrower" key={borrower.id} onClick={() => {
                setQuery(borrower.name);
                setResults([]);
                onSelect?.({
                  firstName,
                  lastName,
                  email: borrower.email,
                  phoneNumber: borrower.phone_number,
                });
              }}>
                {borrower.name} — {borrower.email}
              </div>
            );
          })}
        </ul>
      )}
    </div>
  );
}
