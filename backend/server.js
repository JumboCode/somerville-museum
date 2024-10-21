require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const cors = require('cors');
const { neon } = require("@neondatabase/serverless");

const app = express();
const port = process.env.PORT || 5432;

const sql = neon(process.env.DATABASE_URL); // Ensure DATABASE_URL is set in your environment

// Enable CORS with specific origin
app.use(cors({
    origin: 'http://localhost:3000' // Replace with your frontend's URL
}));

const requestHandler = async (req, res) => {
  try {
    // Perform SQL query
    const result = await sql`SELECT version()`;
    const { version } = result[0]; // Extract version from the query result
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(version);
  } catch (error) {
    console.error('Error querying the Neon database:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Example endpoint
app.get('/version', requestHandler);

// Endpoint to query all data
app.get('/query', async (req, res) => {
    try {
        // Query the 'dummy_data' table
        const result = await sql`SELECT * FROM dummy_data`;
        
        // Send the result back to the client
        res.json(result); // Send the result as a JSON response
    } catch (error) {
        console.error('Error querying the database:', error);
        res.status(500).send('Internal Server Error'); // Send an error response
    }
});

// New endpoint to fetch the first item
app.get('/first-item', async (req, res) => {
    try {
        // Query the 'dummy_data' table for the first item
        const result = await sql`SELECT * FROM dummy_data LIMIT 1`;
        
        // Send the first item back to the client
        res.json(result[0]); // Send the first item as a JSON response
    } catch (error) {
        console.error('Error querying the database:', error);
        res.status(500).send('Internal Server Error'); // Send an error response
    }
});

app.get('/item/:id', async (req, res) => {
  const { id } = req.params;
  try {
      // Query the 'dummy_data' table for the item with the specified ID
      const result = await sql`SELECT * FROM dummy_data WHERE id = ${id}`;
      if (result.length === 0) {
          return res.status(404).send('Item not found');
      }
      // Send the item back to the client
      res.json(result[0]); // Send the item as a JSON response
  } catch (error) {
      console.error('Error querying the database:', error);
      res.status(500).send('Internal Server Error'); // Send an error response
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});