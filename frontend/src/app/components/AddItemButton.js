'use client'

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useState } from 'react';

function PopUp({ handleAdd, close }) {
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAdd(itemName, itemDescription); 
    setItemName(''); 
    setItemDescription('');
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
        Item Description:
        <input
          name="itemDescription"
          value={itemDescription}
          onChange={(e) => setItemDescription(e.target.value)}
        />
      </label>

      <hr />

      <button type="submit">Add Item</button>
    </form>
  );
}

export default function MyForm() {
  const [items, setItems] = useState([]);

  const handleAdd = (name, description) => {
    setItems([...items, { name, description }]); 
    console.log('Item Added:', { name, description });
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

      <div>
        <h3>Items:</h3>
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {item.name}: {item.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
