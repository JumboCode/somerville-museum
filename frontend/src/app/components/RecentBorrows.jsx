"use client";

import React, { useState, useEffect } from "react";
import "./RecentBorrows.css";

const RecentBorrows = () => {
  const [borrowedItems, setBorrowedItems] = useState([]);

  useEffect(() => {
    const getFirstTwoBorrowedItems = async () => {
      try {
        const response = await fetch("../../api/getRecentBorrows");
        const data = await response.json();
        setBorrowedItems(data.borrowedItems);
      } catch (error) {
        console.error("Error fetching borrowed items:", error);
      }
    };

    getFirstTwoBorrowedItems();
  }, []);

  const handleClick = () => {
    // TO DO: Implement functionality to see all borrowed items
  }

  return (
    <div className="recent-borrows">
      <div className="header">
        <h2>Recent Borrows</h2>
        <div  onClick={handleClick} className="see-all">
          SEE ALL
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID#</th>
            <th>Item Name</th>
            <th>Date Borrowed</th>
            <th>Borrower Name</th>
            <th>Borrower Email</th>
          </tr>
        </thead>
        <tbody>
          {borrowedItems.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.date}</td>
              <td>{item.borrowerName}</td>
              <td>{item.borrowerEmail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentBorrows;