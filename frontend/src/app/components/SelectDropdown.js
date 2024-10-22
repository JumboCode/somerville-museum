"use client"; // This file is client-side

import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

const SelectDropdown = ({ onKeywordsChange }) => {
    const [select_Courses, set_Select_Courses] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const courses = [
        { id: 1, label: 'cat' },
        { id: 2, label: 'dog' },
        { id: 3, label: 'apple' },
        { id: 4, label: 'banana' },
        { id: 5, label: 'Holden and Zach' }
    ];
    const dropDownShow = () => {
        setIsOpen(!isOpen);
    };
    const courseChange = (event) => {
        const courseId = parseInt(event.target.value);
        const choosen = event.target.checked;

        let updatedCourses;
        if (choosen) {
            updatedCourses = [...select_Courses, courses.find(course => course.id === courseId).label];
        } else {
            updatedCourses = select_Courses.filter((label) => label !== courses.find(course => course.id === courseId).label);
        }
        set_Select_Courses(updatedCourses);
        onKeywordsChange(updatedCourses); // Pass the updated keywords to the parent component
    };

    return (
        <div>
            <h1>Select Courses</h1>
            <button onClick={dropDownShow}>
                {isOpen ? 'Hide Tags' : 'Show Tags'}
            </button>
            {isOpen && (
                <Form>
                    {courses.map((course) => (
                        <Form.Check
                            key={course.id}
                            type="checkbox"
                            id={`course-${course.id}`}
                            label={course.label}
                            value={course.id}
                            onChange={courseChange}
                        />
                    ))}
                </Form>
            )}
        </div>
    );
};

export default SelectDropdown;