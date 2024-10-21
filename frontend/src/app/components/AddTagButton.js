"use client"; // This file is client-side

import { useState } from 'react';

function AddTagButton() {

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const handleClick = async () => {
    
        try{
            const response = await fetch('http://localhost:5432/query');
            if (!response.ok) {
                throw new Error('Network response was not ok: ${response.statusText');
            }
            console.log("add button clicked");

            const result = await response.json();
            setData(result); // Set the data
            setError(null); // Clear any previous errors
        }
        catch (error) {
            console.error('Error fetching data:', error);
            setError(error.message); // Set the error message
        }

    }

    return (
        <> {/* React fragment to return multiple elements */}
        <div className="tag">
          <button className="AddButton" onClick={handleClick}>
            Click me!
          </button>
          <div className="data">
            {error ? (
              <span className="error">{error}</span>
            ) : (
              data ? (
                <div>
                  <p>ID: {data.id}</p>
                  <p>Name: {data.name}</p>
                  <p>Tags: {data.tags}</p>
                  <p>Note: {data.note}</p>
                  {/* Add more fields as needed */}
                </div>
              ) : (
                'The data will go here'
              )
            )}
          </div>
          <br></br>
          <p>Other info</p>
        </div>
        </>
      );
}

export default AddTagButton;