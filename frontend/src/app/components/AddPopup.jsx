// "use client"; // This file is client-side

// import { useState, useEffect } from 'react';
// import "./AddPopup.css";

// export default function AddPopup() {
//     const [itemName, setItemName] = useState('');
//     const [id, setId] = useState(' ');
//     const [location, setLocation] = useState('');
//     const [note, setNote] = useState('');
//     const [century, setCentury] = useState('');
//     const [size, setSize] = useState('');
//     const [clothingType, setClothingType] = useState('');

// const handleSubmit = async (e) => {
//     e.preventDefault();
//     await handleAdd(id, itemName, note); 
//     setItemName(''); 
//     setNote('');
//     setSelectedTags([]);
//   };

// const handleAdd = async (id, name, note) => {
//     const body = JSON.stringify({
//         name: name,
//         id: id,
//         note: note
//     });
//     console.log('Body:', body); // Should log the body with hardcoded values

//     const response = await fetch(`../../api/addItem`, {
//         method: 'POST',
//         headers: {
//         'Content-Type': 'application/json' // Specify the content type
//         },
//         body: JSON.stringify({ id: id, name: name, note: note}) // Send the id as a JSON object
//     });

// };

// const categoryButtons = document.querySelectorAll('.category-button');

// categoryButtons.forEach(button => {
//   button.addEventListener('click', () => {
//     // Find the parent group to limit selections to that group
//     const parentGroup = button.closest('.button-group');
//     // Remove 'selected' class from all buttons in the group
//     parentGroup.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('selected'));
//     // Add 'selected' class to clicked button
//     button.classList.add('selected');
//   });
// });


// const colorCircles = document.querySelectorAll('.color-circle');

// colorCircles.forEach(circle => {
//   circle.addEventListener('click', () => {
//     // Remove the 'selected' class from all circles
//     colorCircles.forEach(c => c.classList.remove('selected'));
//     // Add 'selected' class to the clicked circle
//     circle.classList.add('selected');
//   });
// });


//     return (
//         <div className="row">
//             <div className="column">
//                 <h1>Add Item</h1>
//                 <br></br>

//                 <img src="/images/DisplayImage.svg" alt="Descriptive text" className="styled-image" />
//                 <br></br>

//                 <form onSubmit={handleSubmit}>
//                     <label>
//                         Item Name*
//                         <input
//                             name="itemName"
//                             value={itemName}
//                             onChange={(e) => setItemName(e.target.value)}
//                         />
//                     </label>
            
//                     {/* Container for ID and Location */}
//                     <div className="inline-row">
//                         <label>
//                             ID
//                             <input
//                                 name="id"
//                                 value={id}
//                                 onChange={(e) => setId(e.target.value)}
//                             />
//                         </label>
//                         <label>
//                             Location*
//                             <input
//                                 name="location"
//                                 value={location}
//                                 onChange={(e) => setLocation(e.target.value)}
//                             />
//                         </label>
//                     </div>
            
//                     {/* Notes large text input box */}
//                     <label>
//                         Notes <br></br>
//                         <textarea
//                             name="note"
//                             value={note}
//                             onChange={(e) => setNote(e.target.value)}
//                             rows="5" // Num. visible rows
//                         ></textarea>
//                     </label>
//                     {/* <button type="submit">Submit</button> */}
//                 </form>
//             </div>

//             <div className="column">
//                 <h2>Tags</h2>
//                 <div className="dropdowns-container">
//                     {/* First Row: Century and Size */}
//                     <div class="inline-row">
//                         <div class="dropdown">
//                             <h3>Century</h3>
//                             <select>
//                                 <option>???</option>
//                             </select>
//                         </div>
//                         <div class="dropdown">
//                             <h3>Size</h3>
//                             <select>
//                                 <option>???</option>
//                             </select>
//                         </div>
//                     </div>
//                     <div class="dropdown">
//                         <h3>Clothing Type</h3>
//                         <select>
//                             <option>???</option>
//                         </select>
//                     </div>
//                     <div class="buttons-container">
//                     <div class="category-buttons">
//                         <h3>Gender</h3>
//                         <div class="button-group">
//                         <button class="category-button" id="male">Male</button>
//                         <button class="category-button" id="female">Female</button>
//                         <button class="category-button" id="unisex">Unisex</button>
//                         </div>
//                     </div>

//                     <div class="category-buttons">
//                         <h3>Season</h3>
//                         <div class="button-group">
//                             <button class="category-button" id="fall">Fall</button>
//                             <button class="category-button" id="winter">Winter</button>
//                             <button class="category-button" id="spring">Spring</button>
//                             <button class="category-button" id="summer">Summer</button>
//                         </div>
//                     </div>
//                     </div>
//                     <div className="color-selector">
//                     <h3>Color</h3>
//                     <div className="color-options">
//                         <div className="color-circle" id="red" style={{ backgroundColor: "red" }}></div>
//                         <div className="color-circle" id="orange" style={{ backgroundColor: "orange" }}></div>
//                         <div className="color-circle" id="yellow" style={{ backgroundColor: "yellow" }}></div>
//                         <div className="color-circle" id="green" style={{ backgroundColor: "green" }}></div>
//                         <div className="color-circle" id="blue" style={{ backgroundColor: "blue" }}></div>
//                         <div className="color-circle" id="purple" style={{ backgroundColor: "purple" }}></div>
//                         <div className="color-circle" id="pink" style={{ backgroundColor: "pink" }}></div>
//                         <div className="color-circle" id="brown" style={{ backgroundColor: "brown" }}></div>
//                         <div
//                         className="color-circle"
//                         id="white"
//                         style={{ backgroundColor: "white", border: "1px solid #ccc" }}
//                         ></div>
//                         <div className="color-circle" id="gray" style={{ backgroundColor: "gray" }}></div>
//                         <div className="color-circle" id="black" style={{ backgroundColor: "black" }}></div>
//                     </div>
//                 </div>
//         <br></br>
//                 </div>
//                 <div class="inline-row">
//                     <button type="submit">Cancel</button>
//                     <button type="submit">Submit</button>
//                 </div>
//             </div>
//         </div>
//     );
// }
