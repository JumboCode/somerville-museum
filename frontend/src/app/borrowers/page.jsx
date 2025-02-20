"use client";
import './Borrowers.css';
import BorrowerTable from './BorrowerTable.jsx';
import { useState, useEffect } from "react";
import StylishButton from '../components/StylishButton.jsx';
import SearchBar from '../components/SearchBar';

export default function BorrowerPage(){
    return (
        <>
            <div>
                <BorrowerTable></BorrowerTable>
            </div>
            <p>hello world</p>
        </>
    )
}

