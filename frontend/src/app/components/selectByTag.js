"use client"; // This file is client-side

import { useState, useEffect } from 'react';

const checkboxStatus = {};
const filters = {};

function getCheckedCheckboxes() {
    const checkedCheckboxes = [];
    document.querySelectorAll(".checkbox:checked").forEach((checkbox) => {
      checkedCheckboxes.push(checkbox.id); // Collect the ID of each checked checkbox
    });
    return checkedCheckboxes;
}

export default function SelectByTag() {
    const [tags, setTags] = useState([]);
    const [error, setError] = useState(null);
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        console.log("Inside fetching tags.");
        const fetchTags = async () => {
            try {
                const response = await fetch('/api/fetchTags');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();

                // Convert the array of objects to an array of strings
                const tagsArray = data.map(item => item.tag);

                // Save the tags in state
                setTags(tagsArray);
            } catch (error) {
                console.error('Error fetching tags:', error);
                setError(error.message);
            }
        };
        
        fetchTags();
    }, []);

    const handleClick = async () => {
        // Get checked checkbox IDs and create the filters object
        const checkedCheckboxes = getCheckedCheckboxes();
        const filters = checkedCheckboxes.reduce((acc, id) => {
            acc[id] = true; // Set each checked ID to true in the filters object
            return acc;
        }, {});

        try {
            const response = await fetch (`../../api/filterStatus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: checkedCheckboxes })
            });
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const result = await response.json();
            setEntries(result);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.message);
        }
    }

    return (
        <div>
            <label class="checkbox-container">
                <input type="checkbox" class="checkbox" id="Available"></input> Available
                <span class="checkmark"></span>
            </label>
            <label class="checkbox-container">
                <input type="checkbox" class="checkbox" id="Borrowed"></input> Borrowed
                <span class="checkmark"></span>
            </label>
            <label class="checkbox-container">
                <input type="checkbox" class="checkbox" id="Overdue"></input> Overdue
                <span class="checkmark"></span>
            </label>

            <label htmlFor="multiSelect">Choose tags:</label>
            <select id="multiSelect">
                {tags.map((tag) => (
                    <option key={tag} value={tag}>
                        {tag}
                    </option>
                ))}
            </select>

            {/* Button to apply selections */}
            <button onClick={handleClick}>Apply</button>

            {/* Printing out the entries after selection */}
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
    );
}
