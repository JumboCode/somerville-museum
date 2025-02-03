'use client'

import React, { useState, useEffect } from 'react';

const BorrowUnit = ({item, onDelete}) => {
    if (!item) {
        return null;
    }
    const {id, name} = item; 
    //image, name, ID, X to delete from display 
    //onChange={handleRemoveItem}

    return ( 
        <div className="borrow-unit">
            <div className="borrow-unit-content">
                <span className='item-id'>{id}</span>
                <span className='item-name'>{name}</span>
            </div>
            <button
                className='delete-button'
                onClick={() => onDelete(item)}
                aria-label={`Delete ${name}`}
            >
                X
            </button>
           
        </div>
        
    )

}

export default BorrowUnit; 