/**
 * @fileoverview Contains dummy page for /settings
 * 
 * @file settings/page.jsx
 * @date 16 February, 2025
 * @authors Ari Goshtasby & Shayne Sidman
 *  
 */

"use client";
import React, { useState, useEffect } from 'react';
import './settings.css';

const Settings = () => {
  const [normalDataEntry, setNormalDataEntry] = useState(true);
  const [fading, setFading] = useState(false);
  const [displayText, setDisplayText] = useState('Data Input');

  const handleToggle = () => {
    setFading(true);
    
    // Wait for fade out to complete before changing the text
    setTimeout(() => {
      setNormalDataEntry(!normalDataEntry);
    }, 100); // Half the transition time to change the state mid-transition
  };

  useEffect(() => {
    // Text changes only after fade out is complete
    const timer = setTimeout(() => {
      setDisplayText(normalDataEntry ? 'Data Input' : 'Normal Data Entry');
      setTimeout(() => {
        setFading(false);
      }, 25);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [normalDataEntry]);

  return (
    <div className="container">
        <div className="wrapper">
            <label className="toggleWrapper">
            <input 
                type="checkbox"
                checked={normalDataEntry}
                onChange={handleToggle}
                className="toggleInput"
            />
            <span className="toggleSlider"></span>
            </label>
            <span className={`toggleLabel ${fading ? 'fading' : ''}`}>
              {displayText}
            </span>
        </div>
    </div>
  );
};

export default Settings;