"use client";
/**
 * @fileoverview Contains dummy page for /settings
 * 
 * @file settings/page.jsx
 * @date 16 February, 2025
 * @authors Arietta M. Goshtasby & Shayne Sidman
 *  
 */

import SettingsPage from "../components/SettingsPage";
import "../components/SettingsPage.css"
import React from 'react';
import './settings.css';

// No need to wrap with GlobalProvider here since it should be at the app level
const Settings = () => {
  return (
    <>
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
      </div>
<<<<<<< HEAD
      <div className="containerSettings">
=======
      <div className="containerS">
>>>>>>> 35dd92777be9c96bb74d0b87fdf1da3bf587f146
        <div className="settings-content-wrapper">
            <div className="settings-page">
              <SettingsPage />
            </div>
        </div>
      </div>
    </>
  );
};

export default Settings;