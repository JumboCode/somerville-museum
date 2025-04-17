import React from 'react';

function CloseButton({ onClick, ariaLabel = "Close" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        position: 'relative',
        width: '30px',
        height: '30px',
        border: '1px solid #9B525F', // Updated border
        borderRadius: '4px',
        cursor: 'pointer',
        background: 'transparent', // Transparent background
        paddingLeft: '5px'
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '20px',
          lineHeight: '1',
          color: '#9B525F'
        }}
      >
        X
      </span>
    </button>
  );
}

export default CloseButton;
