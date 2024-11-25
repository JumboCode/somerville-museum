"use client"; // This file is client-side

import { useState } from 'react';

function PopUp({ handleAdd, close }) {

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
};

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
        <div>
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

      <hr />
      <label>
        ID:
        <input
          name="id"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
      </label>
      <hr />

      <label>
        note:
        <input
          name="note"
          value={note}
          onChange={(e) => setnote(e.target.value)}
        />
      </label>

      <hr />

      <button type="submit">Add Item</button>
    </form>

        </div>
    );
}
