"use client";
import './EliTable.css';
import ELiUnit from './EliUnit';
import { useState } from "react";

export default function ELiTable() {
       
        const [unitCount, setUnitCount] = useState(1);
        const handleSliderChange = (event) => {
            setUnitCount(parseInt(event.target.value));
        };


    return (
        <>
            <div className="slider-container">
                <label htmlFor="unitSlider">Number of Items: {unitCount}</label>
                <input
                    type="range"
                    id="unitSlider"
                    min="1"
                    max="10"
                    value={unitCount}
                    onChange={handleSliderChange}
                />
            </div>
            <div className="Table">
                <div className="Header">
                    <div className="Items">
                        <div className="Searchbar">
                            <input type="text" placeholder="Search..."/>
                        </div>
                            <div className='buttons'> 
                                <button className='addBtn'>ADD</button>
                                <button className='brwBtn'>BORROW</button>
                            </div>
                    </div>
                    <div className="TableLabels">
                        <div className="TableLabel"> ID </div>
                        <div className="TableLabel"> Name </div>
                        <div className="TableLabel"> Status </div>
                        <div className="TableLabel"> Tags </div>
                    </div>
                </div>
                <div className="ItemBarHolder">
                    {Array.from({ length: unitCount }).map((_, index) => (
                                <ELiUnit key={index} />
                            ))}
                </div>
            </div>
        </>
    );
}