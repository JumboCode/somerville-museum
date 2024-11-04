"use client";

import React from "react";
import "./Dashboard.css"

const Dashboard = () => {
    return (
    <nav className="nav-bar">
      <li className="nav-links">
        <p className="nav-items"># of items</p>
        <p className="nav-items"># overdue</p>
        <p className="nav-items"># borrowed</p>
        <p className="nav-items"># missing</p>
        {/* ADD last-element PROPERTY TO LAST ELEMENT IN LIST */}
        <p className="nav-items last-element"># available</p>
      </li>
    </nav>
    );
};

export default Dashboard;