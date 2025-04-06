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
import { io } from "socket.io-client";

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

    const checkisAdmin = (value) => {
        console.log("🔎 Checking admin status for ID:", value);
        return true; // or your actual admin check logic
    };
    //value == "user_2tB9Ny3ALEWuch9VvjlrQemjV8A";

    console.log("👤 Full user object:", user);

    useEffect(() => {
        console.log("🔄 Admin check useEffect triggered");
        if (user) {
            console.log("🔍 user.id from Clerk:", user.id);
            const isAdminResult = checkisAdmin(user.id);
            console.log("🔍 checkisAdmin result:", isAdminResult);
            setIsAdmin(isAdminResult);
        } else {
            console.log("⛔️ Clerk user is not yet loaded.");
        }
    }, [user]);

    // Load approvals from localStorage on page load
    useEffect(() => {
        const savedApprovals = localStorage.getItem("approvals");
        if (savedApprovals) {
            setApprovals(JSON.parse(savedApprovals));
        }
    }, []);

    // Save approvals to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("approvals", JSON.stringify(approvals));
    }, [approvals]);

    useEffect(() => {
        const interval = setInterval(async () => {
          try {
            console.log("🔄 Polling for new approvals...");
            const res = await fetch("/api/pendingApprovals/route");
            const data = await res.json();
      
            setApprovals((prev) => {
              const existingIds = new Set(prev.map((a) => a.id));
              const newUsers = data.filter((u) => !existingIds.has(u.id));
              if (newUsers.length > 0) {
                console.log("📬 New users fetched via polling:", newUsers);
              }
              const updatedList = [...prev, ...newUsers];
              console.log("📊 Updated approvals list:", updatedList);
              return updatedList;
            });
          } catch (err) {
            console.error("Polling error:", err);
          }
        }, 5000);
      
        return () => clearInterval(interval);
    }, []);

    const addVerificationBox = () => {
        console.log("Adding new verification box...");
        setApprovals((prev) => [
            ...prev,
            { id: Date.now(), name: `User ${prev.length + 1}`, email: `user${prev.length + 1}@example.com` }
        ]);
    };

    const approveVerification = async (id) => {
        console.log(`User with ID ${id} approved.`);
    
        // API call to Clerk to approve the user
        const response = await fetch("/api/approveUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: id }),
        });
    
        if (response.ok) {
            console.log("User approved successfully.");
            setApprovals((prev) => prev.filter((approval) => approval.id !== id));
        } else {
            console.error("Failed to approve user.");
        }
    };

    const denyVerification = async (id) => {
        console.log(`User with ID ${id} denied.`);
    
        // API call to delete or block the user in Clerk
        const response = await fetch("/api/denyUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: id }),
        });
    
        if (response.ok) {
            console.log("User denied successfully.");
            setApprovals((prev) => prev.filter((approval) => approval.id !== id));
        } else {
            console.error("Failed to deny user.");
        }
    };

    const handleForgotPassword = () => {
        window.location.href = "/reset_password"; // Redirects user to reset password page
    };

    console.log("Admin status:", isAdmin);
    console.log("Current approvals state:", approvals);

    return (
        <>
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
                                <label className="normal-data-entry">Normal Data Entry</label>
                                <button className="export-btn">⬆ Export Data</button>
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
                                <label className="light-mode">Light Mode</label>
                                <a href="#" className="logout" onClick={() => signOut()}>Logout ↪</a>
                            </div>

                            <button className="addv" onClick={addVerificationBox}>
                                Temp Add Verify
                            </button>
                        </div>
                    </div>
                </div>

                {isAdmin && approvals.length > 0 && (
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
