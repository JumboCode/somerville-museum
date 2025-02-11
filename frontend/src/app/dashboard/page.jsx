/*
 * Authors: Angie and Will
 * Sprint: Dashboard #44
 * Component: Dashboard
 * Purpose: This component displays the dashboard overview page.
*/

"use client";

import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import BarGraph from "./BarGraph";
import PieChart from './PieChart';

const Dashboard = () => {
  const [stats, setStats] = useState([
    { label: 'Total Items', value: 0 },
    { label: 'Currently Borrowed', value: 0 },
    { label: 'Overdue Items', value: 0 },
    { label: 'Missing Items', value: 0 }
  ]);

  const [barGraphData, setBarGraphData] = useState([
    { name: "Available", value: 0 },
    { name: "Borrowed", value: 0 },
    { name: "Overdue", value: 0 },
    { name: "Missing", value: 0 }
  ]);

  // pie chart integration with real data query can come later
  const pieChartData = [
    { name: 'Great Condition', value: 253.44 },
    { name: 'Good Condition', value: 182.7 },
    { name: 'Not Usable', value: 85.08 },
    { name: 'Washing Needed', value: 150.66 },
    { name: 'Dry Cleaning Needed', value: 134.93 },
    { name: 'Repairs Needed', value: 118.25 }
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard');
        const data = await response.json();
        
        // Update stats cards
        setStats([
          { label: 'Total Items', value: data.totalItems },
          { label: 'Currently Borrowed', value: data.borrowedItems },
          { label: 'Overdue Items', value: data.overdueItems },
          { label: 'Missing Items', value: data.missingItems }
        ]);

        // Calculate available items (total - (borrowed + overdue + missing))
        const availableItems = data.totalItems - 
          (data.borrowedItems + data.overdueItems + data.missingItems);

        // Update bar graph data
        setBarGraphData([
          { name: "Available", value: availableItems },
          { name: "Borrowed", value: data.borrowedItems },
          { name: "Overdue", value: data.overdueItems },
          { name: "Missing", value: data.missingItems }
        ]);

      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  /* temporary data for bar graph esting purposes */ 
  const tempBar = ([
    { name: "Available", value: 3 },
    { name: "Borrowed", value: 34 },
    { name: "Overdue", value: 56 },
    { name: "Missing", value: 77 }
  ])

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard Overview</h1>
      
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h2 className="chart-title">Status</h2>
          <div className="chart-container">
            <BarGraph data={barGraphData} />
          </div>
        </div>

        <div className="chart-card">
          <h2 className="chart-title">Conditions</h2>
          <div className="chart-container">
            <PieChart data={pieChartData}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;