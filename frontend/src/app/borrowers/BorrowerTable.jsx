/**
 * @fileoverview Renders all the current Borrowers by default, and updates
 *               borrowers from the BorrowSearchBar as well.
 *               It will show a table with the borrower's Name, Email, Phone 
 *               Number, and Borrow History.
 *               
 * @file BorrowerTabls.jsx
 * @date February 28th, 2025
 * @authors Peter Morganelli, Zack White, and Hannah Jiang
 *  
 */

"use client";
import "../globals.css";
import "./BorrowerTable.css";

export default function BorrowerTable({ searchResults }) {
    // uses the searchResults passed as a prop.
    //if searchResults is empty, it can either stay as an empty array or print an Empty Table message
    const borrowers = searchResults || [];

    return (
        <div className='tableContainer'>
            <div className='tableContent'>
                <table id="borrowerInfo">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Borrow History</th>
                        </tr>
                    </thead>
                    <tbody>
                        {borrowers.length > 0 ? (
                            borrowers.map((borrower, index) => {
                                const hasHistory = borrower.borrow_history && Object.keys(borrower.borrow_history).length > 0;
                                return (
                                    <tr key={index}>
                                        <td>{borrower.name}</td>
                                        <td>{borrower.email}</td>
                                        <td>{borrower.phone_number}</td>
                                        <td>
                                            {hasHistory ? (
                                                Object.keys(borrower.borrow_history).join(", ")
                                            ) : (
                                                "No Borrowing History"
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            //print No Borrowers Found in the case of an empty borrowers table
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center" }}>No borrowers found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
