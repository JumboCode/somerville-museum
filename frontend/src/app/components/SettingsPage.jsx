/**************************************************************
 *
 *                     SettingsPage.jsx
 *
 *        Authors: Massimo Bottari, Elias Swartz
 *           Date: 03/07/2025
 *
 *     Summary: Allows users to log out, change password, view account information,
 *              verify accounts (if admin), and toggle between light and dark mode.
 * 
 **************************************************************/

"use client";

import "../globals.css";
import "./SettingsPage.css";
import UserVerificationCard from "./userVerificationCard.jsx";
import React, { useState, useEffect } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import ExportDataBtn from "./ExportDataBtn.jsx"; // Import the ExportDataBtn component

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
            setIsAdmin(checkisAdmin(user?.id));
            console.log("Admin status updated:", checkisAdmin(user?.id));
        }
    }, [user]);

    useEffect(() => {
        const fetchUnapprovedUsers = async () => {
            if (!isAdmin) return;
    
            try {
                const response = await fetch("/api/get-unapproved-users"); // Your serverless API
                const data = await response.json();
                setApprovals(data.users); // expected shape: [{ id, email, firstName, lastName }]
            } catch (error) {
                console.error("Error fetching unapproved users:", error);
            }
        };
    
        fetchUnapprovedUsers();
    }, [isAdmin]);

    // Save approvals to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("approvals", JSON.stringify(approvals));
    }, [approvals]);

    const addVerificationBox = () => {
        console.log("Adding new verification box...");
        setApprovals((prev) => [
            ...prev,
            { id: Date.now(), name: `User ${prev.length + 1}`, email: `user${prev.length + 1}@example.com` }
        ]);
    };

    const approveVerification = async (id) => {
        try {
            const res = await fetch("/api/approve-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: id }),
            });
    
            if (!res.ok) {
                throw new Error("Approval failed");
            }
    
            console.log(`User with ID ${id} approved.`);
            setApprovals(prev => prev.filter(user => user.id !== id));
        } catch (err) {
            console.error("Approval error:", err);
        }
    };
    

    const denyVerification = (id) => {
        console.log(`User with ID ${id} denied.`);
        setApprovals((prev) => prev.filter((approval) => approval.id !== id));
    };

    const handleForgotPassword = () => {
        window.location.href = "/reset_password"; // Redirects user to reset password page
    };

    // console.log("Admin status:", isAdmin);
    // console.log("Current approvals state:", approvals);
    // console.log("user:", user);
    console.log("firstName:", user?.firstName);
    console.log("lastName:", user?.lastName);
    console.log("email address:", user?.emailAddresses[0]?.emailAddress);


    return (
        <>
            <h1>Settings</h1>
            <div className="body">
                <div className="settings-container">
                    <div className="cardHolders">
                        <p className="subheading">Account Information & Options</p>

                        <div className="profile-card">
                            <h2>Profile</h2>
                            <div className="nameText">
                                <label htmlFor="first-name">First Name</label>
                                <label htmlFor="last-name">Last Name</label>
                            </div>
                            <div className="name">
                                <input type="text" id="first-name" value={user?.firstName || "Holden"} disabled />
                                <input type="text" id="last-name" value={user?.lastName || "Kittleburger"} disabled />
                            </div>
                            <form>
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" value={user?.emailAddresses?.[0]?.emailAddress || "holdenlovesburgers@hotmail.com"} disabled />

                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" value="************" disabled />

                                <div className="change-password-container">
                                    <a href="#" className="change-password" onClick={handleForgotPassword}>
                                        Change Password
                                    </a>
                                </div>
                            </form>
                        </div>

                        <div className="options-card">
                            <div className="toggle">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={normalDataEntry}
                                        onChange={() => setNormalDataEntry(!normalDataEntry)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                                <label>Normal Data Entry</label>
                                <ExportDataBtn></ExportDataBtn>
                            </div>
                            <div className="toggle">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={lightMode}
                                        onChange={() => setLightMode(!lightMode)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                                <label>Light Mode</label>
                                <a href="#" className="logout" onClick={() => signOut()}>Logout ↪</a>
                            </div>

                            
                        </div>
                    </div>
                </div>

                {isAdmin && Array.isArray(approvals) && approvals.length > 0 && (
                    <div className="adminapprovals">
                        <p className="subheading">New Account Approvals</p>
                        <div className="approvalscontainer">
                            {approvals.map((approval) => (
                                <UserVerificationCard 
                                    key={approval.id} 
                                    name={approval.name} 
                                    email={approval.email} 
                                    onApprove={() => approveVerification(approval.id)} 
                                    onDeny={() => denyVerification(approval.id)} 
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}