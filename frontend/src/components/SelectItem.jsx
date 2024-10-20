"use client";  // This directive marks the component as a Client Component

import { useState } from "react";

export default function SelectItemButton() {
    const handleClick = () => {
        alert("Select item!!");
        // Replace the alert with your actual functionality.
    };

    return (
        <button
            className="text-center border p-2 rounded bg-gray-100 hover:bg-gray-200"
            onClick={handleClick}
        >
            Select Item
        </button>
    );
}
