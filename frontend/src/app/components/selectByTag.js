"use client"; // This file is client-side

import { useState } from 'react';

const checkboxStatus = {};
const filters = {};

// // Function to update the checkbox status
// function updateCheckboxStatus() {
//   document.querySelectorAll(".checkbox").forEach((checkbox) => {
//     checkboxStatus[checkbox.id] = checkbox.checked;
//   });
//   console.log(checkboxStatus); // Log the status for demonstration
// }

// // Add event listeners to each checkbox
// document.querySelectorAll(".checkbox").forEach((checkbox) => {
//   checkbox.addEventListener("change", updateCheckboxStatus);
// });

function getCheckedCheckboxes() {
    const checkedCheckboxes = [];
    document.querySelectorAll(".checkbox:checked").forEach((checkbox) => {
      checkedCheckboxes.push(checkbox.id); // Collect the ID of each checked checkbox
    });
    return checkedCheckboxes;
}

export default function SelectByTag() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [entries, setEntries] = useState([]);

    const handleClick = async () => {

        console.log("clicked");

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
                body: JSON.stringify({ filters: checkedCheckboxes })
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
            <button onClick={handleClick}>Apply</button>

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
