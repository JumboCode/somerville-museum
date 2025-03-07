"use client"
/**
 * @fileoverview Contains dummy page for /settings
 * 
 * @file settings/page.jsx
 * @date 16 February, 2025
 * @authors Arietta Goshtasby & Shayne Sidman
 *  
 */

export default function Settings() {
    async function exportData() {
        console.log("IM BEING CALLED")
        try {
            console.log("got here");
            const response = await fetch(`../../api/db`, { 
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                  text: 'SELECT * from dummy_data ORDER BY id'
                })
              });
    
            if (response.ok) {
                const data = await response.json();
                console.log("in fetch data: " + data);
                const currentDate = new Date();
                const updatedData = data.map((item) => {
                    if (item.status === "Borrowed" && item.dueDate && new Date(item.dueDate) < currentDate) {
                        return { ...item, status: "Overdue" };
                    }
                    return item;
                });
    
                setUnits(updatedData);
                
                setTotalPages(Math.ceil(updatedData.length / unitsPerPage));
            } else {
                console.error("failed to fetch data");
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    return (
        <button className="IDLabel" onClick={exportData} id='SortTag'>Export Data</button>
    );
}