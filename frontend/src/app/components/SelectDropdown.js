"use client"; // This file is client-side

import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';

const SelectDropdown = () => {
    const [select_Courses, set_Select_Courses] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const courses = [
        { id: 1, label: 'GATE' },
        { id: 2, label: 'DSA' },
        { id: 3, label: 'JAVA' },
        { id: 4, label: 'C++' },
        { id: 5, label: 'Web Development' }
    ];
    const dropDownShow = () => {
        setIsOpen(!isOpen);
    };
    const courseChange = (event) => {
        const courseId = parseInt(event.target.value);
        const choosen = event.target.checked;

        if (choosen) {
            set_Select_Courses([...select_Courses, courseId]);
        } else {
            set_Select_Courses(select_Courses.filter((id) => id !== courseId));
        }
    };

    const uniqueId = uuidv4(); // Generate a unique ID

    return (
        <div>
            <h1>Select Courses</h1>
            <button onClick={dropDownShow} aria-describedby={`popup-${uniqueId}`}>
                {isOpen ? 'Hide Courses' : 'Show Courses'}
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
                            aria-describedby={`popup-${uniqueId}`}
                        />
                    ))}
                </Form>
            )}
        </div>
    );
};

export default SelectDropdown;