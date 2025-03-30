// BorrowUnit.jsx
//
// Edited by Peter Morganelli, 2/16/25
//
// Purpose: 
//     This file handles the BorrowUnit functionality and uses some styling,
//     which helps with the BorrowPopup component to organize the different selected items
'use client'

import React from 'react';
import Image from "next/image";
import "./BorrowPopup.css";

const BorrowUnit = ({ item, onDelete }) => {
  if (!item) return null;
  const { id, name, image_keys } = item;
  
  // Truncate name to at most 12 characters with ellipsis if needed
  const truncatedName = name.length > 12 ? name.substring(0, 12) + "..." : name;

  return (
    <div className="borrowed-item-box">
      <div className="borrow-image">
        {Array.isArray(image_keys) && image_keys.length > 0 ? (
            <Image 
                src={`https://upload-r2-assets.somerville-museum1.workers.dev/${image_keys[0]}`} 
                fill
                alt="No image found"
            />
        ) : (
            <p>No image found</p>
        )}
      </div>
      <span className="item-name">{truncatedName}</span>
      <span className="item-id">ID #{id}</span>
      <button
        className="delete-button"
        onClick={() => onDelete(item)}
        aria-label={`Delete ${name}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <line x1="18" x2="6" y1="6" y2="18" />
          <line x1="6" x2="18" y1="6" y2="18" />
        </svg>
      </button>
    </div>
  );
};

export default BorrowUnit;
