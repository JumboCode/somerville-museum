"use client";

import "../globals.css";
import "./SettingsPage.css";
import React, { useState, useEffect } from "react";
import { useClerk,  useUser } from '@clerk/nextjs'


export default function SettingsPage() {
    const [lightMode, setLightMode] = useState(false);
    const [normalDataEntry, setNormalDataEntry] = useState(false);
    const { signOut } = useClerk();
    const { user } = useUser();

    // Ensure that the state is defined before using it
    useEffect(() => {
        setNormalDataEntry(false);
        setLightMode(false);
    }, []);

    const isAdmin = user?.publicMetadata?.role === "admin";

    return (
        <>
        <h1>Settings</h1>
        <div className="body">
            <div className="settings-container">
                <div className="cardHolders">
                    <p className="subheading">Account Information & Options</p>

                    <div className="profile-card">
                        <h2>Profile</h2>
                        <form>
                            <label htmlFor="first-name">First Name</label>
                            <input type="text" id="first-name" value={user?.firstName || "Holden"} disabled />

                            <label htmlFor="last-name">Last Name</label>
                            <input type="text" id="last-name" value={user?.lastName || "Kittleburger"} disabled />

                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" value={user?.emailAddresses?.[0]?.emailAddress || "holdenlovesburgers@hotmail.com"} disabled />

                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" value="************" disabled />

                            <a href="#" className="change-password">Change Password</a>
                        </form>
                    </div>

                    <div className="options-card">
                        <div className="toggle">
                            <label>Normal Data Entry</label>
                            <input
                                type="checkbox"
                                checked={normalDataEntry}
                                onChange={() => setNormalDataEntry(!normalDataEntry)}
                            />
                        </div>
                        <div className="toggle">
                            <label>Light Mode</label>
                            <input
                                type="checkbox"
                                checked={lightMode}
                                onChange={() => setLightMode(!lightMode)}
                            />
                        </div>

                        <button className="export-btn">⬆ Export Data</button>
                        <a href="#" className="logout" onClick={() => signOut()}>Logout ↪</a>
                    </div>
                </div>
            </div>

           {isAdmin && (<div className="adminapprovals">
            <p className="subheading">New Account Approvals</p>
            <div className="approvalscontainer">
                <div className="newaccountapprovalbutton">
                    <div className="info">
                    <h2>John Doe </h2>
                    <p>john.doe@gmail.com</p>
                    </div>
                    <div className="buttons">
                        <button>Approve</button>
                        <button>Deny</button>
                    </div>
                </div>
            </div>
            </div>)}
       </div>
       </>
    );
}




// <div className="main">
// <h1 className="settings-title">Settings</h1>

// <h1 className="acc-and-info-title">Account and Information Options</h1>
// <div className={`settings-container ${hasSecondBoxContent ? "has-content" : ""}`}>
//     {/* Main Box (Always Present) */}
//     <div className="settings-box">
//         <h1>Profile</h1>
//         <div className="textBoxRow">
//             <div className="first-name-box">
//                 <textarea 
//                     type="text"
//                     placeholder={user?.emailAddresses?.[0]?.emailAddress}
//                 />
//             </div>

//             <div className="last-name-box">
//                 <textarea 
//                     type="text"
//                     placeholder="kitleburger"
//                 />
//             </div>
//         </div>
//         <div className = "emailTextRow">
//             <div className="email-box">
//                 <textarea 
//                     type="text"
//                     placeholder="email"
//                 />
//             </div>
//         </div>

//         <div className="inputContainer">
//             <input 
//                 className="inputButton" 
//                 type="button" 
//                 value="Log out"
//                 onClick={() => signOut({ redirectUrl: '/' })}  // If not signed in, clicking wont do anything 
//                 />
//         </div>
//     </div>

//     {/* Second Box (Empty Initially, Add Content Dynamically) */}
//     <div className="second-box">
//         {hasSecondBoxContent ? <p>Second Box Content</p> : null}
//     </div>
// </div>

// {/* Button to Toggle Second Box Content for Testing */}
// <button className="toggle-button" onClick={() => setHasSecondBoxContent(!hasSecondBoxContent)}>
//     Toggle Second Box Content
// </button>
// </div>