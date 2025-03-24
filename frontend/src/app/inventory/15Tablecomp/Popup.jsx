
/**************************************************************
 *
 *                     Popup.jsx
 *
 *        Authors: Dan Glorioso & Hannah Jiang & Zack White
 *           Date: 02/16/2025
 *
 *     Summary: The sidebar popup for a selected item in the inventory page.
 * 
 **************************************************************/

"use client";
import "./Popup.css";
import StylishButton from "../../components/StylishButton";
import "./InventoryUnit.css";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Popup( { onClose, onOptionSelect, unitList, unitIndex } ) {
    const [borrowers, setBorrowers] = useState([]);
    const [isClosing, setIsClosing] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);
    const [unit, setUnit] = useState(unitList[unitIndex]);
    const [currIndex, setCurrIndex] = useState(unitIndex);
    

    // Extract the unit details
    const { id, name, status, age_group, gender, color, season, garment_type, size, time_period, condition, cost, location, date_added, borrow_history, notes, image_keys} = unit; 

    // Close container if anywhere but the container is clicked
    const handleContainerClick = (e) => {
        if (e.target.classList.contains("expandedContainer")) {
            closePopup();
        }
    }

    const closePopup = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 200);
    }

    const handleLeftArrow = () => {
        if (currIndex > 0) {
            setCurrIndex(currIndex - 1);
            setUnit(unitList[currIndex - 1]);
        }
    }

    const handleRightArrow = () => {
        if (currIndex < unitList.length - 1) {
            setCurrIndex(currIndex + 1);
            setUnit(unitList[currIndex + 1]);
        }
    }

    // Add event listener for Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                closePopup();
            }
        };

        console.log("pop up is open")

        document.addEventListener("keydown", handleKeyDown);

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    
    // Fetch borrower information
    useEffect(() => {
        const fetchBorrowers = async () => {
            try {
                const response = await fetch(`../../../../api/db`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        text: 'SELECT * FROM borrowers WHERE id = $1',
                        params: [id]
                    })
                });

                if (response.ok) {
                    const data = await response.json();

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
    }, [id]);

    // Set the status missing/found status statement based on the status
    const statusStatement = status === "Missing" ? (
        <button 
            style={{ border: "none", background: "none", color: "red", textDecoration: "underline"}}
            onClick={() => onOptionSelect("Available")}>
            <p style={{fontSize: "1.1em"}}>Mark Item as <span style={{ color: "red", fontWeight: "bold", fontSize: "1em"}}>Found</span></p>
            </button>
    ) : (
        <button style={{ border: "none", background: "none", color: "red", textDecoration: "underline"}}
            onClick={() => onOptionSelect("Missing")}>
            <p style={{fontSize: "1.1em"}}>Mark Item as <span style={{ color: "red", fontWeight: "bold", fontSize: "1em"}}>Missing</span></p>
        </button>
    );

    useEffect(() => {
        if (borrowers && borrowers.length > 0) {
          console.log("borrowers:", borrowers[0].name);
        }
      }, [borrowers]);


    useEffect(() => {
        if (!unit) return;
    }, [unit]);
    
    if (!unit) {
        return null;
    }
      
    return (
        <div className={`expandedContainer ${isClosing ? 'fade-out' : 'fade-in'}`} onClick={handleContainerClick}>
            <div className={`expandedContent ${isClosing ? 'slide-out' : 'slide-in'}`}>
                <div className="headerEC">

                    {/* Title and arrow buttons */}
                    <div className="titleButton">
                        <h2>{name}</h2>
                            <div className="buttons">
                                {/* Left arrow button */}
                                <StylishButton
                                    styleType={"style7"}
                                    onClick={handleLeftArrow}
                                >
                                        <img src="/icons/arrow-left.svg" className="arrowIcon" alt="Next" />
                                </StylishButton>
                                
                                {/* Right arrow button */}
                                <StylishButton
                                    styleType={"style7"}
                                    onClick={handleRightArrow}
                                >
                                    <img src="/icons/arrow-right.svg" className="arrowIcon" alt="Next" />
                                </StylishButton>
                            </div>
                    </div>

                    {/* Close button */}
                    <div className="exit">
                        <StylishButton
                            styleType={"style7"}
                            onClick={closePopup}
                        >
                            <img src="/icons/close.svg" className="closeIcon" alt="Close" />
                        </StylishButton>
                    </div>
                </div>
                
                {/* Image Viewer */}
                <div className="imageContainer">
                    {image_keys && image_keys.length > 0 && (
                        // Note: adding the styling here is the only way I could get the image to fill the container
                        <div className="borrow-image" style={{ width: "100%", height: "100%" }}>
                        <Image
                            src={`https://upload-r2-assets.somerville-museum1.workers.dev/${image_keys[selectedImage]}`}
                            fill
                            alt="No image found"
                            style={{ objectFit: "cover" }}  // Ensures the image covers the container
                        />
                        </div>
                    )}
                </div>

<div className="imageSelection">
    {/* Left arrow button */}
    <StylishButton
        styleType={"style4"}
        onClick={() => setSelectedImage((selectedImage - 1 + image_keys.length) % image_keys.length)}
    >
            <img src="/icons/arrow-left.svg" className="arrowIcon" alt="Next" />
    </StylishButton>
  {image_keys &&
    image_keys.map((key, index) => (
      <StylishButton
        key={index}
        styleType={selectedImage === index ? 'style5' : 'style4'}
        onClick={() => setSelectedImage(index)}
        label={`${index + 1}`}
      />
    ))}

    {/* Right arrow button */}
    <StylishButton
        styleType={"style4"}
        onClick={() => setSelectedImage((selectedImage + 1) % image_keys.length)}
    >
        <img src="/icons/arrow-right.svg" className="arrowIcon" alt="Next" />
    </StylishButton>
</div>


                {/* Info Title and Edit Button */}
                <div className="infoHeader">
                    <h3>Item Information</h3>
                    <Link href={`/edit?id=${id}`}>
                        <StylishButton
                            styleType={"style1"}
                            label={"Edit"}>
                        </StylishButton>
                    </Link>
                </div>

                {/* Item Information Table */}
                <table id="itemInformation">
                    <tbody>
                        <tr>
                            <td><strong>Name: </strong>{name}</td>
                            <td><strong>Size: </strong>{size}</td>
                        </tr>
                        <tr>
                            <td><strong>ID: </strong>{id}</td>
                            <td><strong>Age Group: </strong>{age_group}</td>
                        </tr>
                        <tr>
                            <td><strong>Cost: </strong>${cost}</td>
                            <td><strong>Sex: </strong>{gender}</td>
                        </tr>
                        <tr>
                            <td><strong>Date Added: </strong>{date_added}</td>
                            <td><strong>Season: </strong>{season}</td>
                        </tr>
                        <tr>
                            <td>
                                <strong>Condition: </strong>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                                    <div className={`circle2 ${unit.condition}`}></div>
                                    {condition}
                                </span>
                            </td>
                            <td><strong>Color: </strong>{color}</td>
                        </tr>
                        <tr>
                            <td>
                                <strong>Status: </strong>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                                    <div className={`circle1 ${status}`}></div>
                                    {status}
                                </span>
                            </td>
                            <td><strong>Garment Type: </strong>{garment_type}</td>
                        </tr>

                        <tr>
                            <td>{statusStatement}</td>
                            <td><strong>Time Period: </strong>{time_period}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Big Notes Box */}
                <div className="noteSection"> 
                    <p><strong>Notes</strong></p>
                    <textarea readOnly className="noteBox" value={notes || ""} />
                </div>


                {/* Horizontal diver */}
                <div id = "divider"></div>
                
                {/* Borrow Title and Return Button */}
                <div className="borrowerTitle">
                    <h3>Borrower Information</h3>
                    <div className="returnButton">
                        <Link href={`/return?id=${id}`}>
                            <StylishButton
                                styleType={"style1"}
                                label={"Return"}>
                            </StylishButton>
                        </Link>
                    </div>
                </div>

                {/* Borrower Info */}
                <div id="currentBorrowerContainer">
                    <table id="currentBorrower">
                        <thead>
                            <tr>
                            <th><strong>Current Borrower</strong></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td><strong>Name: </strong>{borrowers.length > 0 ? borrowers[0].name : "N/A"}</td>
                            <td><strong>Date Borrowed: </strong>{borrowers.length > 0 ? borrowers[0].date_borrowed : "N/A"}</td>
                            </tr>
                            <tr>
                            <td><strong>Email: </strong>{borrowers.length > 0 ? borrowers[0].email : "N/A"}</td>
                            <td><strong>Return Date: </strong>{borrowers.length > 0 ? borrowers[0].return_date : "N/A"}</td>
                            </tr>
                            <tr>
                            <td><strong>Cell: </strong>{borrowers.length > 0 ? borrowers[0].phone_number : "N/A"}</td>
                            <td><strong>Approved By: </strong>{borrowers.length > 0 ? borrowers[0].approved_by : "N/A"}</td>
                            </tr>
                        </tbody>
                        </table>

                    {/* Borrow's Notes */}
                    <div className="noteSection"> 
                        <p><strong>Notes</strong></p>
                        <textarea readOnly className="noteBox" value={borrowers.length > 0 ? borrowers[0].notes : ""} />
                    </div>

                </div>

                {/* Borrow History Table */}
                <div id="borrowerHistoryContainer">
                    <p id="borrowerHistorytitle">Borrower History</p> 
                    <table id="borrowerHistory">
                        <tbody>
                            {borrowers.map((borrower, index) => (
                                Object.entries(borrower.borrow_history || {}).map(([itemId, history]) => (
                                    <tr key={`${index}-${itemId}`}>
                                        <td>{history.dateBorrowed || "N/A"} - {history.dateReturned || "N/A"}</td>
                                        <td>{history.approver || "N/A"}</td>
                                        <td>{history.note || "N/A"}</td>
                                    </tr>
                                ))
                            ))}
                        </tbody>
                    </table>
                </div>
            </div> 
        </div>
    );
}