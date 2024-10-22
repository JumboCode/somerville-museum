'use client'

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useState } from 'react';

function PopUp({ handleAdd, close }) {

  const [itemName, setItemName] = useState('');
  const [note, setnote] = useState('');
  const [id, setId] = useState(' ');

  // const hardName = 'angie'; 
  //   const hardDesc = 'she might be a dev';

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
  
  // const singleInsert = async (hardName, hardDesc) => { 
  //   try {

  //     const result = await sql`INSERT INTO dummy_data (id, name, note) 
  //       VALUES (999, 'angie', 'might be a dev')
  //       RETURNING *;`; 

  //       console.log("item inserted with name =", result[0].name);
  //       return result[0]; // Return the inserted item
  //     }
    
  //    catch (err) {
  //       console.error('Error inserting into database:', err);
  //     }
  //   };
  
  const handleAdd = async (id, name, note) => {
    console.log(id, name, note);
    const body = JSON.stringify({
      name: name,
      id: id,
      note: note
  });
  console.log('Body:', body); // Should log the body with hardcoded values

  const response = await fetch('http://localhost:3000/additembutton', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: body
  });
    // if (newItem) {
    //   setItems((items) => [...items, newItem]); // Add the newly added item
    //   console.log('Item Added:', newItem);
    // }
      
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

      {/* <div>
        <h3>Items:</h3>
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {item.name}: {item.note}
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
}
