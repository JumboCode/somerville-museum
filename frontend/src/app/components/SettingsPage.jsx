"use client";

import "../globals.css";
import "./SettingsPage.css";
import React, { useState } from "react";
import { useClerk,  useUser } from '@clerk/nextjs'


export default function SettingsPage() {
    const [hasSecondBoxContent, setHasSecondBoxContent] = useState(false);
    const { signOut } = useClerk();
    const { user } = useUser();

    return (
        <div className="main">
            <h1 className="settings-title">Settings</h1>

            <h1 className="acc-and-info-title">Account and Information Options</h1>
            <div className={`settings-container ${hasSecondBoxContent ? "has-content" : ""}`}>
                {/* Main Box (Always Present) */}
                <div className="settings-box">
                    <p>Main Box Content</p>
                    <div className="textBoxRow">
                        <div className="first-name-box">
                            <textarea 
                                type="text"
                                placeholder={user?.emailAddresses?.[0]?.emailAddress}
                            />
                        </div>

                        <div className="last-name-box">
                            <textarea 
                                type="text"
                                placeholder="kitleburger"
                            />
                        </div>
                    </div>
                    <div className = "emailTextRow">
                        <div className="email-box">
                            <textarea 
                                type="text"
                                placeholder="email"
                            />
                        </div>
                    </div>

                    <div className="inputContainer">
                        <input 
                            className="inputButton" 
                            type="button" 
                            value="Log out"
                            onClick={() => signOut({ redirectUrl: '/' })}  // If not signed in, clicking wont do anything 
                            />
                    </div>
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