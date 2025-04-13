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
import './settings.css';

const Settings = () => {
  return (
    <div className="container">
        <div className = "Settings-Title">
          Settings
        </div>
        <div className="settings-page">
          <SettingsPage />
        </div>
    </div>
  );
};

export default Settings;

