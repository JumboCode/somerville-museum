
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
import Link from "next/link";
import { useEffect } from "react";

export default function Popup( { unit, onClose } ) {
    
    // Case for no unit selected
    if (!unit){
        return null;
    }

    // Extract the unit details
    const { id, name, status, age_group, gender, color, season, garment_type, size, time_period, condition, cost, authenticity_level, location, date_added, borrow_history, notes} = unit; 

    // Close container if anywhere but the container is clicked
    const handleContainerClick = (e) => {
        if (e.target.classList.contains("expandedContainer")) {
            onClose();
        }
    }

    const closePopup = () => {
        onClose();
    }

    // Add event listener for Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                closePopup();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    
    return (
        <div className="expandedContainer" onClick={handleContainerClick}>
            <div className="expandedContent">
                <div className="headerEC">

                    {/* Title and arrow buttons */}
                    <div className="titleButton">
                        <h2>{name}</h2>
                            <div className="buttons">
                                {/* Left arrow button */}
                                <StylishButton
                                    styleType={"style7"}>
                                        <img src="/icons/arrow-left.svg" className="arrowIcon" alt="Next" />
                                </StylishButton>
                                
                                {/* Right arrow button */}
                                <StylishButton
                                    styleType={"style7"}
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
                
                <div className="imageContainer"></div>
                <div className="imageSelection">
                    {/* TODO: Implement image page selectors */}
                </div>

                <div className="infoHeader">
                    <h3>Item Information</h3>
                    <Link href={`/edit?id=${id}`}>
                        <StylishButton
                            styleType={"style1"}
                            label={"Edit"}>
                        </StylishButton>
                    </Link>
                </div>

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
                            <td><strong>Cost: </strong>{cost}</td>
                            <td><strong>Gender: </strong>{gender}</td>
                        </tr>
                        <tr>
                            <td><strong>Date Added: </strong>{date_added}</td>
                            <td><strong>Season: </strong>{season}</td>
                        </tr>
                        <tr>
                            <td><strong>Condition: </strong>{condition}</td>
                            <td><strong>Color: </strong>{color}</td>
                        </tr>
                        <tr>
                            <td><strong>Status: </strong>{status}</td>
                            <td><strong>Garment Type: </strong>{garment_type}</td>
                        </tr>
                        <tr>
                            <td>Mark Item as <strong>Found</strong></td>
                            <td><strong>Time Period: </strong>{time_period}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Divider */}
                <div className="noteSection"> 
                    <h3>Notes</h3>
                    <textarea readOnly id="noteBox">
                        {notes}
                    </textarea>
                </div>

                {/* Horizontal diver */}
                <br></br>
            </div> 
        </div>
    );
}