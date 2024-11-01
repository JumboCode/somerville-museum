
//!IMPORTANT
//Use the SelectItem button component created by Dan and Elisa, to select an item based on a particular id.
//IMPORTANT
"use client";
import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './ExpandedEntry.css';

function ExpandedEntry({ itemData, onClose }) {
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState('');
    const [newNote, setNewNote] = useState('');
    const [showSaveButton, setShowSaveButton] = useState(false);
    const [showDiscardButton, setShowDiscardButton] = useState(false);
    const [showEditButton, setShowEditButton] = useState(true);
    const [showReturnButton, setShowReturnButton] = useState(true);

    useEffect(() => {
        if (itemData) {
            setNewName(itemData.name);
            setNewNote(itemData.note || '');
        }
    }, [itemData]);

    const onEdit = () => {
        setIsEditing(true);
        setShowSaveButton(true);
        setShowDiscardButton(true);
        setShowEditButton(false);
        setShowReturnButton(false);
    };

    const onSave = () => {
        // Save the new name and note (you can add your API call here)
        itemData.name = newName;
        itemData.note = newNote;
        setIsEditing(false);
        setShowSaveButton(false);
        setShowDiscardButton(false);
        setShowEditButton(true);
        setShowReturnButton(true);
    };

    const onDiscard = () => {
        // Discard the changes and reset the state
        setNewName(itemData.name);
        setNewNote(itemData.note || '');
        setIsEditing(false);
        setShowSaveButton(false);
        setShowDiscardButton(false);
        setShowEditButton(true);
        setShowReturnButton(true);
    };

    return (
        <Popup open={true} onClose={onClose} modal nested>
            <div className='modal'>
            {itemData && (
                <div className="overlay">
                    <div className="popup">

                        <div className="header">
                            <div className="image-placeholder">
                                <img className="image-icon"
                                    src="https://www.hagca.com/uploads/1/2/7/1/127145683/holden-kittelberger-headshot_orig.jpg"
                                    alt="Holden Kittelberger"
                                />
                            </div>
                            
                            <div className="item-details">

                                    <div>
                                        {isEditing ? (
                                            <div>
                                                <input
                                                    type="text"
                                                    value={newName}
                                                    onChange={(e) => setNewName(e.target.value)}
                                                    className="form-control"
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                <h2 className="item-title">{itemData.name}</h2>                                                                                
                                            </div>
                                        )}
                                        <div className="item-id">ID: {itemData.id}</div>
                                        <div className="status">Status: N/A</div>
                                        <div className="tags">
                                            Tags:
                                            {itemData.tags && itemData.tags.map((tag, index) => (
                                                <div key={index} className="tag">{tag}</div>
                                            ))}
                                        </div>
                                    </div>
                                
                            </div>
                            
                            {/*ADD THE DATA CALLS TO FILL IN THIS FORMATION LATER WHEN THESE ATTRIBUTES EXIST-->*/}
                            <div className="borrower-info">
                                <p>Borrower: John Smith</p>
                                <p>Email: John.Smith@xxxx.xxx</p>
                                <p>Cell: (XXX) XXX-XXXX</p>
                                <p>Date Borrowed: XX/XX/XXXX</p>
                                <p>Return Date: XX/XX/XXXX</p>
                                <p className="approval">Approved By: J. Appleseed</p>
                            </div>
                        </div>
                        
                        {isEditing ? (
                            <div>
                                <textarea
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    className="form-control"
                                    placeholder="Enter note"
                                />
                            </div>
                        ) : (
                            <div className="content">
                                <p>Note: {itemData.note}</p>
                            </div>
                        )}

                        <div className="actions">
                            {showEditButton && <button onClick={onEdit} className="button button-edit">🖊️ Edit</button>}
                            {showSaveButton && <button onClick={onSave} className="button button-save">✔️ Save Changes</button>}
                            {showDiscardButton && <button onClick={onDiscard} className="button button-edit">❌ Discard Changes</button>}
                            {showReturnButton && <button onClick={onClose} className="button button-return">Return</button>}
                        </div>
                    </div>
                </div>
                )}
            </div>
        </Popup>
    );
  }

  export default ExpandedEntry;
