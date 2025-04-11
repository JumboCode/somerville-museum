/**************************************************************
 *
 *                     ExportDataBtn.jsx
 *
 *        Authors: Elisa Yu, Arietta M. Goshtasby
 *           Date: 03/30/2025
 *
 *     Summary: Export Button on setting page that downloads an excel file 
 *              with all data from item Objects in the database.
 * 
 **************************************************************/

'use client'

import React, { useState, useEffect } from "react";
import './ExportDataBtn.css';
import * as XLSX from 'xlsx';

const ExportDataBtn = () => {


    // This function is triggered when the button is clicked
    const handleButtonClick = async () => {
        try {
            // Step 1: Fetch inventory data
            const inventoryResponse = await fetch(`../../api/db`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: 'SELECT * from dummy_data',
                    params: [],
                }),
            });

            if (!inventoryResponse.ok) {
                throw new Error(`Fetch error: ${inventoryResponse.status} - ${inventoryResponse.statusText}`);
            }
            
            const inventoryData = await inventoryResponse.json();
            // console.log("Inventory data:", inventoryData);

            if (!Array.isArray(inventoryData)) {
                throw new Error("Invalid inventory data format");
            }

            // Step 2: Collect all borrower IDs
            const borrowerIds = new Set();
            
            inventoryData.forEach(item => {
                // Add current borrower ID if it exists
                if (item.current_borrower) {
                    borrowerIds.add(item.current_borrower);
                }
                
                // Add all borrower history IDs if they exist
                if (Array.isArray(item.borrow_history)) {
                    item.borrow_history.forEach(id => borrowerIds.add(id));
                } else if (item.borrow_history) {
                    borrowerIds.add(item.borrow_history);
                }
            });
            
            // Convert Set to Array for the query
            const borrowerIdsArray = Array.from(borrowerIds);
            
            // Step 3: Fetch borrower information if we have any IDs
            let borrowerMap = {};
            
            if (borrowerIdsArray.length > 0) {
                const borrowerResponse = await fetch(`../../api/db`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text: 'SELECT id, name, email FROM borrowers WHERE id = ANY($1)',
                        params: [borrowerIdsArray],
                    }),
                });

                if (!borrowerResponse.ok) {
                    throw new Error(`Borrower fetch error: ${borrowerResponse.status} - ${borrowerResponse.statusText}`);
                }
                
                const borrowerData = await borrowerResponse.json();
                // console.log("Borrower data:", borrowerData);
                
                // Create a map for fast lookup
                borrowerMap = borrowerData.reduce((map, borrower) => {
                    map[borrower.id] = { name: borrower.name, email: borrower.email };
                    return map;
                }, {});
            }
            
            // Step 4: Process inventory data with borrower information
            const filteredData = inventoryData.map(item => {
                // Process arrays
                const timePeriodFormatted = Array.isArray(item.time_period) 
                    ? item.time_period.join(', ') 
                    : item.time_period;
                
                const colorFormatted = Array.isArray(item.color)
                    ? item.color.join(', ')
                    : item.color;
                
                const seasonFormatted = Array.isArray(item.season)
                    ? item.season.join(', ')
                    : item.season;
                
                const conditionFormatted = Array.isArray(item.condition)
                    ? item.condition.join(', ')
                    : item.condition;
                
                // Process current borrower
                let currentBorrowerInfo = "None";
                if (item.current_borrower && borrowerMap[item.current_borrower]) {
                    const borrower = borrowerMap[item.current_borrower];
                    currentBorrowerInfo = `${borrower.name} (${borrower.email})`;
                }
                
                // Process borrower history
                let borrowHistoryInfo = "";
                if (Array.isArray(item.borrow_history) && item.borrow_history.length > 0) {
                    borrowHistoryInfo = item.borrow_history.map(id => {
                        if (borrowerMap[id]) {
                            return `${borrowerMap[id].name}`;
                        }
                        return `ID: ${id}`;
                    }).join(', ');
                } else if (item.borrow_history && borrowerMap[item.borrow_history]) {
                    const borrower = borrowerMap[item.borrow_history];
                    borrowHistoryInfo = `${borrower.name} (${borrower.email})`;
                } else {
                    borrowHistoryInfo = "None";
                }
                
                return {
                    id: item.id,
                    name: item.name,
                    status: item.status,
                    age_group: item.age_group,
                    gender: item.gender,
                    color: colorFormatted,
                    season: seasonFormatted,
                    garment_type: item.garment_type,
                    size: item.size,
                    time_period: timePeriodFormatted,
                    condition: conditionFormatted,
                    cost: item.cost,
                    location: item.location,
                    date_added: item.date_added,
                    current_borrower: currentBorrowerInfo,
                    borrow_history: borrowHistoryInfo,
                    notes: item.notes
                };
            });
            
            // Create a new workbook
            const workbook = XLSX.utils.book_new();
            
            // Convert the JSON data to a worksheet
            const worksheet = XLSX.utils.json_to_sheet(filteredData);
            
            // Add the worksheet to the workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Data");
            
            // Generate an Excel file
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            
            // Create a Blob from the buffer
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            
            // Create a URL for the Blob
            const url = URL.createObjectURL(blob);
            
            // Create a link element and trigger download
            const link = document.createElement('a');
            link.href = url;
            link.download = 'inventory_data.xlsx';
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error){
            alert("An error occurred. Please try again.");
            return;
        }

    }

  return (
    <div>
      <button className="export-btn"
        onClick={handleButtonClick}
      >⬆ Export Data</button>
    </div>
  );
};

export default ExportDataBtn;
