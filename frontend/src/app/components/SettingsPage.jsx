"use client";

import "../globals.css";
import "./SettingsPage.css";
import UserVerificationCard from "./userVerificationCard.jsx";
import React, { useState, useEffect } from "react";
import { useClerk, useUser } from "@clerk/nextjs";

export default function SettingsPage() {
    const [lightMode, setLightMode] = useState(false);
    const [normalDataEntry, setNormalDataEntry] = useState(false);
    const { signOut } = useClerk();
    const { user } = useUser();

    const [isAdmin, setIsAdmin] = useState(false);
    const [approvals, setApprovals] = useState([]);

    const checkisAdmin = (value) => value == "user_2tB9Ny3ALEWuch9VvjlrQemjV8A";

    useEffect(() => {
        if (user) {
            console.log("user id: " + user?.id);
            console.log("user id string: " + "user_2tB9Ny3ALEWuch9VvjlrQemjV8A")
            setIsAdmin(checkisAdmin(user?.id));
            console.log("Admin status updated:", checkisAdmin(user?.id));
        }
    }, [user]);

    const addVerificationBox = () => {
        console.log("User object id:", user?.id);
        console.log("Adding new verification box...");

        setApprovals((prev) => {
            const updatedApprovals = [...prev, { name: `User ${prev.length + 1}`, email: `user${prev.length + 1}@example.com` }];
            console.log("Updated approvals:", updatedApprovals);
            return updatedApprovals;
        });
    };

    console.log("Admin status:", isAdmin);
    console.log("Current approvals state:", approvals);

    return (
        <>
            <h1>Settings</h1>
            <p>Admin Status: {isAdmin ? "Yes" : "No"}</p> {/* Debugging */}
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

                            <button className="addv" onClick={addVerificationBox}>
                                Temp Add Verify
                            </button>

                            <button className="export-btn">⬆ Export Data</button>
                            <a href="#" className="logout" onClick={() => signOut()}>Logout ↪</a>
                        </div>
                    </div>
                </div>

                {isAdmin && (
                    <div className="adminapprovals">
                        <p className="subheading">New Account Approvals</p>
                        <div className="approvalscontainer">
                            <UserVerificationCard name="Massimoooo" email="Mass@grailed.com" />
                            {approvals.map((approval, index) => (
                                <UserVerificationCard key={index} name={approval.name} email={approval.email} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
