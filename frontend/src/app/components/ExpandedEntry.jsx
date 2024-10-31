
//!IMPORTANT
//Use the SelectItem button component created by Dan and Elisa, to select an item based on a particular id.
//IMPORTANT
"use client";
import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import './ExpandedEntry.css';

function ExpandedEntry({ itemData, onClose }) {
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
                        
                        <div className="content">
                            <p>Note: {itemData.note}</p>
                        </div>
                        
                        <div className="actions">
                            <button className="button button-edit">🖊️ Edit</button>
                            <button onClick={onClose} className="button button-return">Return</button>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </Popup>
    );
  }

  export default ExpandedEntry;
