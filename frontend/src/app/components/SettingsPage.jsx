/**************************************************************
 *
 * SettingsPage.jsx
 *
 * Authors: Massimo Bottari, Elias Swartz (Updated by Peter Morganelli)
 * Date: 03/07/2025
 *
 **************************************************************/
"use client";
import "../globals.css";
import "./SettingsPage.css";
import UserVerificationCard from "./userVerificationCard.jsx";
import React, { useState, useEffect } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import ExportDataBtn from "./ExportDataBtn.jsx";
import { useGlobalContext } from './contexts/ToggleContext';

export default function SettingsPage() {
  const [lightMode, setLightMode] = useState(false);
  const { isToggleEnabled, setIsToggleEnabled } = useGlobalContext(); // Use the global context
  const [fading, setFading] = useState(false);
  const [displayText, setDisplayText] = useState(isToggleEnabled ? 'Data Input' : 'Normal Data Entry');
  const { signOut } = useClerk();
  const { user } = useUser();
  const [normalDataEntry, setNormalDataEntry] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [approvals, setApprovals] = useState([]);

  const checkisAdmin = (value) => value === process.env.NEXT_PUBLIC_ADMIN_CLERK_ID;

  // Update display text when component mounts to ensure it's in sync with context
  useEffect(() => {
    setDisplayText(isToggleEnabled ? 'Data Input' : 'Normal Data Entry');
  }, [isToggleEnabled]);

  useEffect(() => {
    if (user) {
      console.log("user id: " + user?.id);
      setIsAdmin(checkisAdmin(user?.id));
      console.log("Admin status updated:", checkisAdmin(user?.id));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setIsAdmin(checkisAdmin(user?.id));
    }
  }, [user]);

  useEffect(() => {
    const savedApprovals = localStorage.getItem("approvals");
    if (savedApprovals) {
      setApprovals(JSON.parse(savedApprovals));
    }
  }, []);

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

  useEffect(() => {
    localStorage.setItem("approvals", JSON.stringify(approvals));
  }, [approvals]);

  const addVerificationBox = () => {
    setApprovals((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: `User ${prev.length + 1}`,
        email: `user${prev.length + 1}@example.com`,
      },
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
    setApprovals((prev) => prev.filter((approval) => approval.id !== id));
  };

  const handleForgotPassword = () => {
    window.location.href = "/reset_password";
  };

  return (
    <>
      <div className="settings-page">
        <div className="account-header">
          <h2 className="account-subheading">Account Information & Options</h2>
        </div>
        <div className="body">
          <div className="left-column">
            <div className="profile-card">
              <h2 className="profile-card-title">Profile</h2>
              <div className="nameText">
                <label htmlFor="first-name">First Name</label>
                <label htmlFor="last-name">Last Name</label>
              </div>
              <div className="name">
                <input
                  type="text"
                  id="first-name"
                  value={user?.firstName || ""}
                  disabled
                />
                <input
                  type="text"
                  id="last-name"
                  value={user?.lastName || ""}
                  disabled
                />
              </div>
              <form>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={
                    user?.emailAddresses?.[0]?.emailAddress ||
                    ""
                  }
                  disabled
                />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" value="************" disabled />
                <div className="change-password-container">
                  <a
                    href="#"
                    className="change-password"
                    onClick={handleForgotPassword}
                  >
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
                <label>{normalDataEntry ? 'Data Input' : 'Normal Data Entry'}</label>
                <ExportDataBtn />
              </div>
              <div className="toggle-logout">                  
                <button className="logout" onClick={() => signOut()}>
                  <span className="logout-btn-content">
                    Logout
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="logout-icon"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" x2="9" y1="12" y2="12" />
                    </svg>
                  </span>
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
      </div>
    </>
  );
}