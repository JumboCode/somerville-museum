"use client";
import './EliTable.css';

export default function ELiTable() {
    return (
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
                <div className="Itembar">
                    <input type="checkbox" className="checkbox" />
                    <img class="artwork__image" src="/" />
                    <div className="TableLabels">
                        <div className="TableLabel"> ID </div>
                        <div className="TableLabel"> Name </div>
                        <div className="TableLabel"> Status </div>
                        <div className="TableLabel"> Tags </div>
                     </div>
                    <button className="dropdown"></button>
                </div>
            </div>
        </div>
    );
}