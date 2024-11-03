'use client';

import React, { useState } from 'react';

const SortAlphaButton = () => {
  const [entries, setEntries] = useState([]);
  const [isSortedById, setIsSortedById] = useState(true); // Track which sort is active

  const handleFetchClick = async () => {
    try {
      const response = await fetch(`../../api/queryAll`, { 
        method: 'GET',
      }); // Get dump of dummy_data
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setEntries(data); // Store fetched data in state
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const sortById = () => {
    const sortedEntries = [...entries].sort((a, b) => a.id - b.id); // Sort by id
    setEntries(sortedEntries);
    setIsSortedById(true);
  };

  const sortByName = () => {
    const filteredAndSortedEntries = [...entries]
      .filter((entry) => entry.id >= 500 && entry.id <= 599) // Only include IDs between 500 and 599
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

    setEntries(filteredAndSortedEntries);
    setIsSortedById(false);
  };

  return (
    // Return three buttons: one for all data, one sorted by ID, one alphabetically id 500-599
    <div>
      <button type="button" onClick={handleFetchClick}>
        Fetch Entries
      </button>

      <button type="button" onClick={sortById} disabled={isSortedById}>
        Sort by ID
      </button>

      <button type="button" onClick={sortByName} disabled={!isSortedById}>
        Sort Alphabetically (ID 500-599)
      </button>

      <div>
        {entries.length > 0 ? (
          <ul>
            {entries.map((entry) => (
              <li key={entry.id}>
                <strong>ID:</strong> {entry.id} <strong>Name:</strong> {entry.name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No entries available.</p>
        )}
      </div>
    </div>
  );
};

export default SortAlphaButton;
