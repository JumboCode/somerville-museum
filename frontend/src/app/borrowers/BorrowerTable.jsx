"use client";

import { useState, useEffect } from 'react';
import "../globals.css";
import "./BorrowerTable.css"
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import StylishButton from '../components/StylishButton.jsx';
import Link from 'next/link';

export default function BorrowerTable() {
    const [borrowers, setBorrowers] = useState([]);

        // Extract the unit details
        // const { id, name, status, age_group, gender, color, season, garment_type, size, time_period, condition, cost, authenticity_level, location, date_added, borrow_history, notes} = unit; 

    useEffect(() => {
        const fetchBorrowers = async () => {
            try {
                const response = await fetch(`../../../../api/db`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text: 'SELECT * FROM borrowers',
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    // DATA IS AT data.rows
                    const borrowData = data.map((borrower) => {
                        return {
                            name: borrower.name,
                            email: borrower.email,
                            phone_number: borrower.phone_number,
                            borrow_history: borrower.borrow_history,
                            id_borrows_borrower_id: borrower.id_borrows_borrower_id,
                        };
                    });

                    setBorrowers(borrowData);
                    console.log(borrowData);
                } else {
                    console.error("Failed to fetch borrower data");
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchBorrowers();
    }, []);

    useEffect(() => {
        if (borrowers && borrowers.length > 0) {
        //   console.log("borrowers:", borrowers[0].name);
        }
    }, [borrowers]);  

    return (
        <div className='tableContainer'>
            <div className='tableContent'>
                <table id="BorrowerInfo">
                <tbody>
                    {borrowers.map((borrower, index) => (
                        borrower.borrow_history && Object.keys(borrower.borrow_history).length > 0 ? (
                            Object.entries(borrower.borrow_history).map(([itemId, history]) => (
                                <tr key={`${index}-${itemId}`}>
                                    <td>{borrower.name}</td>
                                    <td>{borrower.email}</td>
                                    <td>{borrower.phone_number}</td>
                                </tr>
                            ))
                        ) : (
                            <tr key={index}>
                                <td>{borrower.name}</td>
                                <td>{borrower.email}</td>
                                <td>{borrower.phone_number}</td>
                                <td colSpan="3">No Borrowing History</td>
                            </tr>
                        )
                    ))}
                </tbody>


                    {/* <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Number</th>
                        <th>Borrowing History</th>
                    </tr>
                    <tr>
                        <td>{borrowers.length > 0 ? borrowers[0].name : "N/A"}</td>
                        <td>{borrowers.length > 0 ? borrowers[0].email : "N/A"}</td>
                        <td>{borrowers.length > 0 ? borrowers[0].phone_number : "N/A"}</td>
                    </tr> */}
                </table>
            </div>
        </div>
    )
}