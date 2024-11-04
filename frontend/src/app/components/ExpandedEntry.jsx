
//!IMPORTANT
//Use the SelectItem button component created by Dan and Elisa, to select an item based on a particular id.
//IMPORTANT
"use client";
import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './ExpandedEntry.css';
import SelectDropdown from './SelectDropdown';

function ExpandedEntry({ itemData, onClose }) {
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState('');
    const [newNote, setNewNote] = useState('');
    const [newID, setNewID] = useState('');
    const [keywords, setKeywords] = useState([]);
    const [showSaveButton, setShowSaveButton] = useState(false);
    const [showDiscardButton, setShowDiscardButton] = useState(false);
    const [showEditButton, setShowEditButton] = useState(true);
    const [showReturnButton, setShowReturnButton] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (itemData) {
            setNewName(itemData.name);
            setNewNote(itemData.note || '');
            setNewID(itemData.id); 
            setKeywords(itemData.tags || []);
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
        itemData.name = newName;
        itemData.note = newNote;
        itemData.tags = keywords;
        setIsEditing(false);
        setShowSaveButton(false);
        setShowDiscardButton(false);
        setShowEditButton(true);
        setShowReturnButton(true);
    };

    const onDiscard = () => {
        setNewName(itemData.name);
        setNewNote(itemData.note || '');
        setNewID(itemData.id);
        setKeywords(itemData.tags || []);
        setIsEditing(false);
        setShowSaveButton(false);
        setShowDiscardButton(false);
        setShowEditButton(true);
        setShowReturnButton(true);
    };

    const handleUpdateNote = async (event) => {
        try {
            const response = await fetch("../../api/updateNote", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: itemData.id, note: newNote }), // Update the note
            });
            if (!response.ok) {
                throw new Error('Failed to update note');
            }
        } catch (error) {
            setError(error.message);
        }
    };
    
    const handleUpdateName = async (event) => {
        try {
            const response = await fetch("../../api/updateName", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: itemData.id, name: newName }), // Update the note
            });
            if (!response.ok) {
                throw new Error('Failed to update name');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleKeywordsChange = (newKeywords) => {
        setKeywords(newKeywords);
    };
    
    const handleUpdateTags = async () => {
        if (!itemData) return;
    
        try {
            const response = await fetch(`../../api/updateTags`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: itemData.id, tags: keywords }),
            });
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const result = await response.json();
            setError(null);
        } catch (error) {
            console.error('Error updating tags:', error);
            setError(error.message);
        }
    };
    
    const handleUpdateID = async (event) => {
        try {
            const response = await fetch('../../api/updateID', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: itemData.id,
                    newId: newID,
                    data: {
                        name: itemData.name,
                        note: itemData.note,
                        tags: itemData.tags
                    }
                }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update ID');
            }
            if (response.status === 201) {
                console.log(data.message);
                alert(data.message);
            } else {
                console.log('ID updated successfully');
                alert('ID updated successfully');
            }
        } catch (error) {
            alert(error.message);
            console.error(error.message);
        }
    };

    const handleSaveAndUpdate = () => {
        onSave();
        handleUpdateNote();
        handleUpdateName();
        handleUpdateTags();
        handleUpdateID();
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
                                            <p>Name: </p>
                                            <input
                                                type="text"
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                                className="content form-control"
                                                placeholder="Enter name"
                                            />
                                            <p>ID: </p>
                                            <input
                                                type="text"
                                                value={newID}
                                                onChange={(e) => setNewID(e.target.value)}
                                                className="content form-control"
                                                placeholder={itemData.id}
                                            />
                                            <p>Tags: </p>
                                            <SelectDropdown selectedTags={keywords} onKeywordsChange={handleKeywordsChange} />
                                        </div>
                                    ) : (
                                        <div>
                                            <h2 className="item-title">{itemData.name}</h2> 
                                            <div className="item-id">ID: {itemData.id}</div>   
                                            <div className="status">Status: N/A</div>     
                                            <div className="tags">
                                            Tags:
                                            {itemData.tags && itemData.tags.map((tag, index) => (
                                                <div key={index} className="tag">{tag}</div>
                                            ))}
                                        </div>                                                                       
                                        </div>
                                    )}
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
                                <p>Note: </p>
                                <textarea
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    className="content form-control"
                                    placeholder="Enter note"
                                />
                            </div>
                        ) : (
                            <div className="content">
                                <p>{itemData.note}</p>
                            </div>
                        )}

                        <div className="actions">
                            {showEditButton && <button onClick={onEdit} className="button button-edit">🖊️ Edit</button>}
                            {showSaveButton && <button onClick={handleSaveAndUpdate} className="button button-save">✔️ Save Changes</button>}
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