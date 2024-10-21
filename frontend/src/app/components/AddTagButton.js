/*Add button.js*/

"use client"; // This file is client-side

import { useState } from 'react';

function AddTagButton() {
  const [data, setData] = useState(null);

  // Function to handle the button click
  const handleClick = async () => {
    try {
      const response = await fetch('http://localhost:3000/query');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      console.log("Add button clicked");

      const result = await response.json();
      setData(result[0]); // Return the first element of the result
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <> {/* React fragment to return multiple elements */}
    <div className="tag">
      <button className="custom-button" onClick={handleClick}>
        Click me!
      </button>
      <div className="data">
        {data ? JSON.stringify(data) : 'The data will go here'}
      </div>
      <p>More info</p>
    </div>
    </>
  );
}

export default AddTagButton; // Export the component so it can be imported and used in other files