"use client";
/**
 * @fileoverview Contains dummy page for /settings
 * 
 * @file settings/page.jsx
 * @date 16 February, 2025
 * @authors Arietta M. Goshtasby & Shayne Sidman
 *  
 */
import { useClerk } from "@clerk/nextjs";
import SettingsPage from "../components/SettingsPage";
import "../components/SettingsPage.css"
import React from 'react';
import './settings.css';

// No need to wrap with GlobalProvider here since it should be at the app level
const Settings = () => {
  const { signOut } = useClerk();

  return (
    <div className="settings-container">
        <SettingsPage />
    </div>
  );
};

export default Settings;