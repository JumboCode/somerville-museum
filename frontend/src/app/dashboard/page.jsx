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

  const [pieChartData, setPieChartData] = useState([
    { name: 'Great', value: 0 },
    { name: 'Good', value: 0 },
    { name: 'Not usable', value: 0 },
    { name: 'Needs washing', value: 0 },
    { name: 'Needs dry cleaning', value: 0 },
    { name: 'Needs repair', value: 0 }
  ]);
 

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



     try {
      const pieResponse = await fetch('/api/getCondition');
      const PieData = await pieResponse.json();


      setPieChartData([
        { name: 'Great', value: PieData.great },
        { name: 'Good', value: PieData.good },
        { name: 'Not usable', value: PieData.notUsable },
        { name: 'Needs washing', value: PieData.needsWashing },
        { name: 'Needs Dry Cleaning', value: PieData.needsDryCleaning },
        { name: 'Needs repair', value: PieData.needsRepair }
      ]);


    } catch (error) {
      console.error('Error retrieving conditions:', error);
    }

      
    };


    fetchStats();
  }, []);

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