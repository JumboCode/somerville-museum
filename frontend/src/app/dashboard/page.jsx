import React from 'react';
import './Dashboard.css';
import BarGraph from "./BarGraph";

const Dashboard = () => {
  // Sample data for now, I'll replace it later when I do the backend stuff
  const stats = [
    { label: 'Total Items', value: 200 },
    { label: 'Currently Borrowed', value: 80 },
    { label: 'Overdue Items', value: 15 },
    { label: 'Missing Items', value: 5 }
  ];

  const barGraphData = [
    { name: "Available", value: 100 },
    { name: "Borrowed", value: 80 },
    { name: "Overdue", value: 15 },
    { name: "Missing", value: 5 }
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard Overview</h1>
      
      {/* Stats Cards */}
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
            {/* Placeholder for future pie chart */}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;