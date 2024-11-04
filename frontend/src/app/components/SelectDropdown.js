"use client"; // This file is client-side

import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import './SelectDropdown.css';

const SelectDropdown = ({ selectedTags, onKeywordsChange }) => {
    const [select_tags, set_Select_tags] = useState(selectedTags || []);

    const tags = [
        { id: 1, label: 'XS' },
        { id: 2, label: 'S' },
        { id: 3, label: 'M' },
        { id: 4, label: 'L' },
        { id: 5, label: 'XL' },
        { id: 6, label: 'Red' },
        { id: 7, label: 'Blue' },
        { id: 8, label: 'Yellow' },
        { id: 9, label: 'Old' },
        { id: 10, label: 'New' },
    ];

    useEffect(() => {
        set_Select_tags(selectedTags || []);
    }, [selectedTags]);


    const tagChange = (event) => {
        const tagId = parseInt(event.target.value);
        const choosen = event.target.checked;
        const tagLabel = tags.find(tag => tag.id === tagId).label;

        let updatedtags;
        if (choosen) {
            updatedtags = [...select_tags, tagLabel];
        } else {
            updatedtags = select_tags.filter((label) => label !== tagLabel);
        }
        set_Select_tags(updatedtags);
        onKeywordsChange(updatedtags); // Pass the updated keywords to the parent component
    };

    return (
        <div>
            <br></br>
            <Form className="tags">
                {tags.map((tag) => (
                    <div key={tag.id} className="tag">
                    <Form.Check
                        type="checkbox"
                        id={`tag-${tag.id}`}
                        label={` ${tag.label}`}
                        value={tag.id}
                        checked={select_tags.includes(tag.label)}
                        onChange={tagChange}
                        className="checkbox"
                    />
                    {tag.id === 6 && (
                        <div className="indicator" style={{ backgroundColor: "#FF0000" }}></div>
                    )}
                    {tag.id === 7 && (
                         <div className="indicator" style={{ backgroundColor: "#0000FF" }}></div>
                    )}
                    {tag.id === 8 && (
                        <div className="indicator" style={{ backgroundColor: "#F7FF00" }}></div>
                    )}
                </div>
                ))}
            </Form>
        </div>
    );
};

export default SelectDropdown;