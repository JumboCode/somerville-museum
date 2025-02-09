'use client'
import React, { useEffect, useRef } from "react";
import './/../globals.css'; 
import './BarGraph.css';
import { select, scaleBand, scaleLinear, max, axisBottom, axisLeft, range } from "d3";

const BarGraph = ({ data }) => {
    const svgRef = useRef();

    useEffect(() => {
        const handleResize = () => {
            if (data.length) {
                drawChart(data);
            }
        };

        window.addEventListener("resize", handleResize);
        drawChart(data); // Initial render

        return () => window.removeEventListener("resize", handleResize);
    }, [data]);

   const drawChart = (data) => {
    if (!svgRef.current) return;

    const margin = { top: 25, right: 20, bottom: 60, left: 40};
    const containerWidth = svgRef.current.parentElement.clientWidth;
    const width = containerWidth - margin.left - margin.right;
    const height = (containerWidth * 0.6) - margin.top - margin.bottom; // Proportional height

    // Clear previous SVG elements
    const svg = select(svgRef.current);
    svg.selectAll("*").remove();

    svg.attr("width", containerWidth).attr("height", height + margin.top + margin.bottom);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const yMax = max(data, d => d.value) || 10;
    const xScale = scaleBand()
        .domain(data.map(d => d.name))
        .range([0, width])
        .padding(0.1);

    const yScale = scaleLinear()
        .domain([0, yMax])
        .range([height, 0]);

    const barWidth = xScale.bandwidth() * 0.7; // Adjusts bar width dynamically

    // Draw gray background bars
    chart.selectAll(".gray-bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "gray-bar")
        .attr("x", d => xScale(d.name) + (xScale.bandwidth() - barWidth) / 2) // Center bars
        .attr("y", 0)
        .attr("width", barWidth) // Make sure gray bars match actual bars
        .attr("height", height)
        .attr("fill", "var(--gray-bar)");

    // Draw actual data bars
    chart.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.name) + (xScale.bandwidth() - barWidth) / 2) // Align bars to center
        .attr("y", d => yScale(d.value))
        .attr("width", barWidth)
        .attr("height", d => Math.max(0, height - yScale(d.value))) // Prevent bars exceeding axis
        .attr("fill", (d, i) => `var(--bar-color-${i + 1})`);

    // ** Remove small tick marks above each bar label **
    const xAxis = axisBottom(xScale).tickSize(0); // Set tick size to 0

    chart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .attr("class", "bar-label")
        .call(xAxis)
        .select(".domain") // Hide x-axis base line

    // ** Append y-axis with only numbers (no ticks or line) **
    const yAxis = chart.append("g")
        .call(axisLeft(yScale).tickValues(range(0, yMax + 10, 10))) // Only interval numbers
        .attr("class", "bar-label")
        .call(g => g.select(".domain").remove()) // Remove y-axis solid line
        .call(g => g.selectAll("line").remove()); // Remove tick marks


    // ** Draw the dotted y-axis manually **
    chart.append("line")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", 0)
        .attr("y2", height)
        .style("stroke", "gray")
        .style("stroke-width", 1)
        .style("stroke-dasharray", "2,2") // Dotted effect
        .style("opacity", 0.4);

    // ** Add horizontal grid lines at each tick on y-axis **
    chart.selectAll(".grid-line")
        .data(yScale.ticks()) // Get tick values
        .enter()
        .append("line")
        .attr("class", "grid-line")
        .attr("x1", 0)
        .attr("x2", width) // Full width of graph
        .attr("y1", d => yScale(d))
        .attr("y2", d => yScale(d))
        .style("stroke", "gray")
        .style("stroke-width", 1)
        .style("stroke-dasharray", "2,2") // Dotted effect
        .style("opacity", 0.4); // Slightly transparent

    // ** Add vertical dotted lines properly centered between bars **
    chart.selectAll(".bar-divider")
        .data(data.slice(0, -1)) // Exclude last element (to avoid extra line)
        .enter()
        .append("line")
        .attr("class", "bar-divider")
        .attr("x1", (d, i) => xScale(d.name) + xScale.bandwidth() + (xScale.step() - xScale.bandwidth()) / 2) // Proper centering
        .attr("x2", (d, i) => xScale(d.name) + xScale.bandwidth() + (xScale.step() - xScale.bandwidth()) / 2)
        .attr("y1", 0)
        .attr("y2", height)
        .style("stroke", "gray")
        .style("stroke-width", 1)
        .style("stroke-dasharray", "2,2") // Dotted effect
        .style("opacity", 0.4);


    // ** Add a vertical border on the right side **
    chart.append("line")
        .attr("x1", width)
        .attr("x2", width)
        .attr("y1", 0)
        .attr("y2", height)
        .style("stroke", "gray")
        .style("stroke-width", 1)
        .style("stroke-dasharray", "2,2") // Dotted effect
        .style("opacity", 0.4);
};


    return (
        // <div className="barGraphContainer">
        //     <h2 className="barGraphTitle">Status</h2>
            <div>
                <svg className="svgContainer" ref={svgRef}></svg>
            </div>
        // </div>
    ); 
};

export default BarGraph;