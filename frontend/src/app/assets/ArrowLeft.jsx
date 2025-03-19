'use client';
import React from 'react';

const ArrowLeft = ({ onClick, ariaLabel = "Previous" }) => {
  return (
    <button 
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        width: '30px',
        height: '30px',
        border: '1px solid #9B525F',
        borderRadius: '4px',
        background: 'transparent',
        cursor: 'pointer',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="main-grid-item-icon" fill="none" stroke="#9B525F" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <polyline points="15 18 9 12 15 6" />
    </svg>  
    </button>
  );
};

export default ArrowLeft;
