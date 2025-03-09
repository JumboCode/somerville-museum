"use client"
/**
 * @fileoverview Contains dummy page for /settings
 * 
 * @file settings/page.jsx
 * @date 16 February, 2025
 * @authors Arietta Goshtasby & Shayne Sidman
 *  
 */

import { useClerk } from '@clerk/nextjs';
import React, { useState } from 'react';
import './settings.css';
import { useGlobalContext } from '../components/contexts/ToggleContext';

const Settings = () => {
  const { signOut } = useClerk();
  const { isToggleEnabled, setIsToggleEnabled } = useGlobalContext();
  const [fading, setFading] = useState(false);
  const [displayText, setDisplayText] = useState(isToggleEnabled ? 'Data Input' : 'Normal Data Entry');

  const handleToggle = () => {
    setFading(true);

    // Directly use the current state to toggle
    const newToggleState = !isToggleEnabled;
    setIsToggleEnabled(newToggleState);

    // Wait for fade out to complete before changing the text
    setTimeout(() => {
      setDisplayText(newToggleState ? 'Data Input' : 'Normal Data Entry');
      setTimeout(() => {
        setFading(false);
      }, 25);
    }, 100);
  };

  return (
    <div className="container">
      <div className="wrapper">
        <label className="toggleWrapper">
          <input
            type="checkbox"
            checked={isToggleEnabled}
            onChange={handleToggle}
            className="toggleInput"
          />
          <span className="toggleSlider"></span>
        </label>
        <span className={`toggleLabel ${fading ? 'fading' : ''}`}>
          {displayText}
        </span>
        <div onClick={() => signOut({ redirectUrl: '/' })}>Sign Out</div>
      </div>
    </div>
  );
};

export default Settings; // Ensure this is exported as default