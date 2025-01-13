/**
 * @fileoverview Page that shows inventory overview and general statistics.
 * 
 * @file Dashboard.jsx
 * @date January 12th, 2025
 * @authors John Doe
 *  
 */

"use client";

import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import RecentBorrows from './RecentBorrows.jsx';

const Dashboard = () => {
  // State to store the counts for each status
  const [counts, setCounts] = useState({
    Total: null,
    Overdue: null,
    Borrowed: null,
    Available: null,
  });

  // Function to fetch the count from the backend for a specific status
  const fetchCountForStatus = async (status) => {
    try {
      const response = await fetch(`../../api/selectCounts`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: status }), // Status to query
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Update the state with the count for this status
      setCounts((prevCounts) => ({
        ...prevCounts,
        [status]: data.count,
      }));
    } catch (error) {
      console.error(`Error fetching count for ${status}:`, error);
    }
  };

  // Fetch counts for each status when the component mounts
  useEffect(() => {  // TO DO: UPDATE TOTAL; QUERY FILTERS BY STATUS CURRENTLY
    const statuses = ['Total', 'Overdue', 'Borrowed', 'Available']; //ADD SQL injection HERE

    statuses.forEach((status) => {
      fetchCountForStatus(status);
    });
  }, []); // Only run once when the component mounts

  return (
    <div>
      <h1>Inventory Dashboard</h1>
      <div className="wrapper">
        <div className="placeholder"></div><div className="placeholder"></div><div className="placeholder"></div>
      </div>
      <br></br>
      <h2>Overview</h2>
      <nav className="nav-bar">
        <ul className="nav-links">
          {Object.entries(counts).map(([status, count]) => (
            <li key={status} className="nav-items">
              <p>{status}: {count !== null ? count : "Loading..."}</p>
            </li>
          ))}
        </ul>
      </nav>
      <br></br>
      <h2>Recent Borrows</h2>
      {/* <RecentBorrows /> */}
    </div>
  );
};

export default Dashboard;

