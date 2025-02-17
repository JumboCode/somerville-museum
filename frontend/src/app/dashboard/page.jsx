// /**
//  * @fileoverview Contains dummy dashboard landing page. Only important thing is log out button
//  * 
//  * @file dashboard/page.jsx
//  * @date 16 February, 2025
//  * @authors Ari Goshtasby & Shayne Sidman
//  *  
//  */

// "use client";

// import "../app.css"
// import { useClerk } from '@clerk/nextjs'

// export default function Dashboard() {
//   const { signOut } = useClerk();

//   return (
//     <div>
//       <div className="login-bg">
//         <div className="mainContainer">
//           Dashboard
//           <div className="inputContainer">
//             <input 
//               className="inputButton" 
//               type="button" 
//               value="Log out"
//               onClick={() => signOut({ redirectUrl: '/' })}  // If not signed in, clicking wont do anything 
//             />
//           </div>
//         </div>
//       </div>
//     </div>

//   );
// }
"use client";

import React, { useState, useEffect } from "react";
import "../components/Dashboard.css"
import RecentBorrows from "../components/RecentBorrows";

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
      <div className="login-bg">
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
        <RecentBorrows />
      </div>
    </div>
  );
};

export default Dashboard;

