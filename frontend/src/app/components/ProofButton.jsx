"use client";

import React, { useState } from "react";

const FetchTextFileButton = () => {
  const [fileContent, setFileContent] = useState("");
  const [error, setError] = useState("");

  const fetchFile = async () => {
    const url = "https://sm-test.somerville-museum1.workers.dev/test.txt"; // Replace with your Worker URL

    try {
      setError(""); // Reset error message
      setFileContent(""); // Reset file content

      const response = await fetch(url);

      if (!response.ok) {
        setError(`Error: ${response.status} - ${response.statusText}`);
        return;
      }

      // Read the text content of the file
      const text = await response.text();
      setFileContent(text);
    } catch (err) {
      setError(`Fetch failed: ${err.message}`);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <button onClick={fetchFile} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Fetch Text File
      </button>

      {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}

      {fileContent && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            backgroundColor: "#f9f9f9",
            whiteSpace: "pre-wrap",
            textAlign: "left",
          }}
        >
          <h4>File Content:</h4>
          <p>{fileContent}</p>
        </div>
      )}
    </div>
  );
};

export default FetchTextFileButton;