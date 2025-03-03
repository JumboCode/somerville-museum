"use client";

import "../globals.css";
import "./SettingsPage.css";
import React, { useState } from "react";

export default function SettingsPage() {
    const [hasSecondBoxContent, setHasSecondBoxContent] = useState(false);

    return (
        <div className="main">
            <h1 className="settings-title">Settings</h1>

            <h1 className="acc-and-info-title">Account and Information Options</h1>
            <div className={`settings-container ${hasSecondBoxContent ? "has-content" : ""}`}>
                {/* Main Box (Always Present) */}
                <div className="settings-box">
                    <p>Main Box Content</p>
                </div>

                {/* Second Box (Empty Initially, Add Content Dynamically) */}
                <div className="second-box">
                    {hasSecondBoxContent ? <p>Second Box Content</p> : null}
                </div>
            </div>

            {/* Button to Toggle Second Box Content for Testing */}
            <button className="toggle-button" onClick={() => setHasSecondBoxContent(!hasSecondBoxContent)}>
                Toggle Second Box Content
            </button>
        </div>
    );
}