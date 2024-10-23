require('dotenv').config();

const express = require('express');
const app = express();


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
const port = 3001; // You can use environment variables for port configuration
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


app.get('/', (req, res) => {
    res.send('<h1>Welcome to backend server!</h1>');
});

app.get('/version', requestHandler);

app.post('localhost://3001/query', async (req, res) => {
    const { id } = req.body; // Get ID from the request body
    console.log('Received ID:', id); // Print the received ID
    try {
        console.log('Executing SQL query to find item with ID:', id);

        const result = await sql`SELECT * FROM dummy_data WHERE id = ${id}`;

        console.log('Query Result:', result); // Print the result of the query

        if (result.length === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(result[0]); // Send the first item back as JSON
    } catch (error) {
        console.error('Error querying the database:', error);
        res.status(500).send('Internal Server Error');
    }
});
