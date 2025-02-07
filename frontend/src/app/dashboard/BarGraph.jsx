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

        const margin = { top: 50, right: 30, bottom: 60, left: 50 };
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

        const barWidth = xScale.bandwidth() * 0.7;

        // Draw gray background bars
        chart.selectAll(".gray-bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "gray-bar")
            .attr("x", d => xScale(d.name) + (xScale.bandwidth() - barWidth) / 2) // Center bars
            .attr("y", 0)
            .attr("width", xScale.bandwidth() * 0.5)
            .attr("height", d => height )
            .attr("fill", "var(--gray-bar)");

        // Draw actual data bars
        chart.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.name) + (xScale.bandwidth() - barWidth) / 2) // Perfect centering
            .attr("y", d => yScale(d.value)) // Correct Y position
            .attr("width", barWidth) // Dynamic bar width
            .attr("height", d => Math.max(0, height - yScale(d.value))) // Prevents overflow
            .attr("fill", (d, i) => `var(--bar-color-${i + 1})`);
        

        // Create axes
        chart.append("g")
            .attr("transform", `translate(0, ${height})`)
            .attr("class", "bar-label")
            .call(axisBottom(xScale));

        chart.append("g")
            .attr("class", "bar-label")
            .call(axisLeft(yScale).tickValues(range(0, yMax + 10, 10)));
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