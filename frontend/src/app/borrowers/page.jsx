"use client";
import './Borrowers.css';
import BorrowerTable from './BorrowerTable.jsx';
import { useState, useEffect } from "react";
import StylishButton from '../components/StylishButton.jsx';
import SearchBar from '../components/SearchBar';

export default function BorrowerPage() {
    const [searchResults, setSearchResults] = useState([]);
    return (
        <>
            <div className='Items'>
                <SearchBar updateSearchResults={setSearchResults} />    
                <BorrowerTable></BorrowerTable>
            </div>
        </>
    )
}

