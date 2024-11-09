"use client"; // This file is client-side

import { useState, useEffect } from 'react';

// Function to get an array of the names of the checked checkboxes
function getCheckedCheckboxes() {
    const checkedCheckboxes = [];
    document.querySelectorAll(".checkbox:checked").forEach((checkbox) => {
      checkedCheckboxes.push(checkbox.id); // Collect the ID of each checked checkbox
    });
    return checkedCheckboxes;
}

// Function to get the array of selected tags 
function getSelectedTags() {
    const selectedOptions = [];
    const dropdown = document.getElementById("multiSelect");

    // Loop through each selected option in the dropdown
    Array.from(dropdown.selectedOptions).forEach((option) => {
        selectedOptions.push(option.value); // Collect the value of each selected option
    });

    return selectedOptions;
}

// Main function to render the component 
export default function SelectByTag() {
    const [tags, setTags] = useState([]);
    const [error, setError] = useState(null);
    const [entries, setEntries] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    // Fetch the tags from the API (automatically on load)
    useEffect(() => {
        const fetchTags = async () => {
            try {
                // Fetch all tags from the API
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
        
        // Call the fetchTags function
        fetchTags();
    }, []);

    const handleClick = async () => {
        // Clear entries in state setEntries([])
        setEntries([]);

        // Get checked checkbox IDs and create the filters object
        const checkedCheckboxes = getCheckedCheckboxes();
        const selectedTags = getSelectedTags();

        // Create the data object to send to the API
        const data = {
            status: checkedCheckboxes,
            tags: selectedTags
        }

        // Run the request to get the filtered items
        try {
            const response = await fetch (`../../api/filterStatusTags`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // Send the data object as JSON
                body: JSON.stringify(data) 
            });
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const result = await response.json();

            // Set the resulting entries in state
            setEntries(result);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.message);
        }
    }

    // Function to handle the multi-selection of tags
    const handleSelect = (e) => {
        // Get selected options as an array
        const selectedOptions = Array.from(e.target.selectedOptions); 

        // Extract values
        const values = selectedOptions.map(option => option.value); 
        
        // Update state with the selected values
        setSelectedTags(values); 
    };

    return (
        <div>
            {/* Checkboxes for status */}
            <div>
                <label class="checkbox-container">
                    <input type="checkbox" class="checkbox" id="Available"></input> Available
                    <span class="checkmark"></span>
                </label>
            </div>
            <div>
                <label class="checkbox-container">
                    <input type="checkbox" class="checkbox" id="Borrowed"></input> Borrowed
                    <span class="checkmark"></span>
                </label>
            </div>
            <div>
                <label class="checkbox-container">
                    <input type="checkbox" class="checkbox" id="Overdue"></input> Overdue
                    <span class="checkmark"></span>
                </label>
            </div>

            {/* Multi-select dropdown for tags */}
            <div>
                <div>
                    <label htmlFor="multiSelect">Choose tags:</label>
                </div>
                <select id="multiSelect" multiple onChange={(e) => handleSelect(e)}>
                    {tags.map((tag) => (
                        <option key={tag} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>
            </div>

            {/* Button to apply selections */}
            <div>
                <button onClick={handleClick}>Apply</button>
            </div>

            {/* Printing out the entries after selection */}
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
}
