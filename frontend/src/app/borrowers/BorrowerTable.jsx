"use client";
import "../globals.css";
import "./BorrowerTable.css";

export default function BorrowerTable({ searchResults, onSelectBorrower }) {
  const borrowers = searchResults || [];

  return (
    <div className="tableContainer">
      <div className="tableContent">
        <table id="borrowerInfo">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Borrow History</th>
              <th>{/*col for ... dots */}</th>
            </tr>
          </thead>
          <tbody>
            {borrowers.length > 0 ? (
              borrowers.map((borrower, index) => {
                const hasHistory =
                  borrower.borrow_history &&
                  Object.keys(borrower.borrow_history).length > 0;
                return (
                  <tr key={index} onDoubleClick={() => onSelectBorrower(borrower)}>
                    <td>{borrower.name}</td>
                    <td>{borrower.email}</td>
                    <td>{borrower.phone_number}</td>
                    <td>
                      {hasHistory
                        ? Object.keys(borrower.borrow_history).join(", ")
                        : "No Borrowing History"}
                    </td>
                    <td onClick={() => onSelectBorrower(borrower)}>
                      <span className="three-dots">...</span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No borrowers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
