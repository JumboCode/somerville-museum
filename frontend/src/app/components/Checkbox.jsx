"use client";

import React from "react";
import "./Checkbox.css";

const Checkbox = ({ label, checked, onChange }) => {
  return (
    <div className="checkbox" onClick={onChange} style={{ cursor: "pointer" }}>
      <button
        className="checkbox-button"
        style={{
          backgroundColor: checked ? "#9B525F" : "#FFFFFF",
          color: checked ? "#FFFFFF" : "#9B525F",
        }}
      >
        {checked ? "✓" : ""}
      </button>
      <p className="check-text">{label}</p>
    </div>
  );
};

export default Checkbox;
