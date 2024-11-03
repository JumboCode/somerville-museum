'use client'

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
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

  return (
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
  );
}

export default function MyForm() {
  const [items, setItems] = useState([]);
  
  
  const handleAdd = async (id, name, note) => {
    const body = JSON.stringify({
      name: name,
      id: id,
      note: note
  });
  console.log('Body:', body); // Should log the body with hardcoded values

  const response = await fetch(`../../api/addItem`, { 
    method: 'PUT',
    headers: {
    'Content-Type': 'application/json' // Specify the content type
    },
    body: JSON.stringify({ id: id, name: name, note: note}) // Send the id as a JSON object
  });

  };
      

  return (
    <div>
      <Popup
        trigger={<button> Add Item </button>}
        modal
        nested
      >
        {(close) => (
          <div className='modal'>
            <div className='content'>
              <PopUp handleAdd={handleAdd} close={close} />
            </div>
            <div>
              <button onClick={() => close()}>Exit</button>
            </div>
          </div>
        )}
      </Popup>

    </div>
  );
}
