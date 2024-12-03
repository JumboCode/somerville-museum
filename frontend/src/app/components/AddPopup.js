"use client"; // This file is client-side

import { useState } from 'react';

export default function AddPopup() {
    const [itemName, setItemName] = useState('');
    const [note, setnote] = useState('');
    const [id, setId] = useState(' ');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      await handleAdd(id, itemName, note); 
      setItemName(''); 
      setnote('');
      close(); 
    };

    return (
      <div className="row">
        <div className="column">
          <h1>Add Item</h1>
    
          <form onSubmit={handleSubmit}>
            <label>
              Item Name:
              <input
                name="itemName"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </label>
        
            {/* Container for ID and Location */}
            <div className="inline-row">
              <label>
                ID:
                <input
                  name="id"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
              </label>
              <label>
                Location*
                <input
                  name="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </label>
            </div>
        
            <label>
              Notes <br></br>
              <textarea
                  name="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows="5" // Number of visible rows
              ></textarea>
          </label>
        
          </form>
        </div>
    
        <div className="column">
          <h2>Tags</h2>
          <button type="submit">Cancel</button>
          <button type="submit">Submit</button>
        </div>
    
        <style jsx>{`
          .row {
            display: grid;
            grid-template-columns: 1fr 1.3fr;
            margin: 20px;
          }
          .column {
            border: 1px solid #ccc;
            padding: 20px;
          }
          .inline-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px; /* Space between the ID and Location inputs */
            align-items: center; /* Align items vertically in the center */
          }
          input, textarea {
            display: block;
            width: 100%; /* Adjusts to the full width of the column */
            box-sizing: border-box; /* Ensures padding is included in the width */
            margin-top: 8px;
            margin-bottom: 12px;
            padding: 8px;
            border: 1px solid #000;
            border-radius: 4px;
          }
          button {
            padding: 10px 20px;
            border: none;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
}
