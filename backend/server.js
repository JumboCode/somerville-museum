require('dotenv').config();

const express = require('express');
const app = express();

// Needed to add this for sprint 5 week 1 shayne and mira to work
const cors = require('cors');
app.use(cors()); // Enable CORS for all routes

const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

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

//initialize the port we are listening on and let us ping it
const port = process.env.PGPORT || 3000; // You can use environment variables for port configuration
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


app.get('/', (req, res) => {
    res.send('<h1>Welcome to backend server!</h1>');
});

app.get('/version', requestHandler);

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

app.get('/sortalphaquery', async (req, res) => {
  try {
      // Query the 'dummy_data' table
      const result = await sql`SELECT id, name FROM dummy_data WHERE id >= 500 AND id<= 599 ORDER BY name;`;
      
      // Send the result back to the client
      res.json(result); // Send the result as a JSON response
    } catch (error) {
      console.error('Error querying the database:', error);
      res.status(500).send('Internal Server Error'); // Send an error response
    }
});

