"use client";
import './Borrowers.css';
import BorrowerTable from './BorrowerTable.jsx';
import { useState, useEffect } from "react";
import StylishButton from '../components/StylishButton.jsx';
import BorrowerSearchBar from '../components/BorrowerSearchBar'

export default function BorrowerPage() {
    const [searchResults, setSearchResults] = useState([]);
    return (
        <>
            {/* <div className='Items'>
                <BorrowerSearchBar updateSearchResults={setSearchResults} />    
                <BorrowerTable></BorrowerTable>
            </div> */}
            <div className='Items'>
                <BorrowerSearchBar updateSearchResults={setSearchResults} />    
                <BorrowerTable searchResults={searchResults} />
            </div>
        </>
    )
}

