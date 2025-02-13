/*
 * Authors: Angie and Will
 * Sprint: Dashboard #44
 * Component: Pie Chart
 * Purpose: This component displays a pie chart with the condition of items.
*/

'use client'
import React, { useEffect, useRef } from "react";
import './/../globals.css';
import './PieChart.css'
import * as d3 from "d3";


const PieChart = ({ data }) => {
   const svgRef = useRef();


   useEffect(() => {
       const handleResize = () => {
           if (data.length) {
               drawChart();
           }
       };


       window.addEventListener("resize", handleResize);
       drawChart(); // Initial render


       return () => window.removeEventListener("resize", handleResize);
   }, [data]);


   const drawChart = () => {
    if (!svgRef.current || data.length === 0) return;

    const parent = svgRef.current.parentElement;
    const width = parent.clientWidth;
    const height = parent.clientHeight;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    // Make SVG responsive
    svg
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

    const chart = svg.append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Pie and arc setup
    const pie = d3.pie().value(d => d.value);
    const arcs = pie(data);

    const arc = d3.arc()
        .innerRadius(0) // Full pie
        .outerRadius(radius);

    // Define color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Append pie slices
    chart.selectAll("path")
        .data(arcs)
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => `var(--pie-${i + 1})`)
        .style("stroke", "none"); // ❌ Remove white stroke

    chart.selectAll("text")
        .data(arcs)
        .enter()
        .append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`) // Center text in slices
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("fill", "white") // Adjust text color for visibility
        .style("font-size", "14px")
        .style("font-weight", "600")
        .style("font-family", "Inter")
        .text(d => (d.value && d.value > 0) ? d.value : ""); // Display value only if > 0
    

   };


   return (
       <div className="chart-container">
           <svg ref={svgRef} className="svg-container"></svg>
           <div className="key-grid">
            <div className="key-item">
                <div className="key-dot" style={{ backgroundColor: 'var(--pie-1)' }}></div>
                <span className="chart-label">Great Condition</span>
            </div>
            <div className="key-item">
                <div className="key-dot" style={{ backgroundColor: 'var(--pie-2)' }}></div>
                <span className="chart-label">Good Condition</span>
            </div>
            <div className="key-item">
                <div className="key-dot" style={{ backgroundColor: 'var(--pie-3)' }}></div>
                <span className="chart-label">Not Usable</span>
            </div>
            <div className="key-item">
                <div className="key-dot" style={{ backgroundColor: 'var(--pie-4)' }}></div>
                <span className="chart-label">Washing Needed</span>
            </div>
            <div className="key-item">
                <div className="key-dot" style={{ backgroundColor: 'var(--pie-5)' }}></div>
                <span className="chart-label">Dry Cleaning Needed</span>
            </div>
            <div className="key-item">
                <div className="key-dot" style={{ backgroundColor: 'var(--pie-6)' }}></div>
                <span className="chart-label">Repairs Needed</span>
            </div>
            </div>
       </div>
   );
};


export default PieChart;