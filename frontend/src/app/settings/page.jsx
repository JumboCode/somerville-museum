/**
 * @fileoverview Contains dummy page for /settings
 * 
 * @file settings/page.jsx
 * @date 16 February, 2025
 * @authors Ari Goshtasby & Shayne Sidman
 *  
 */

"use client";

import React, { useState, useEffect } from "react";
import SettingsPage from "../components/SettingsPage";
import "../components/SettingsPage.css"


const Settings = () => {
    return (
        <div className="settings-page">
        <SettingsPage />
        </div>
    );
}

export default Settings;