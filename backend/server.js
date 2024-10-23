require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Import cors
const { neon } = require("@neondatabase/serverless");

const app = express();
const sql = neon(process.env.DATABASE_URL);

app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // To parse JSON request bodies

// Example route for version check (if needed)
const requestHandler = async (req, res) => {
    try {
        const result = await sql`SELECT version()`;
        const { version } = result[0];
        res.status(200).send(version);
    } catch (error) {
        console.error('Error querying the Neon database:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Route to query an item by ID
app.post('/query', async (req, res) => {
    const { id } = req.body; // Get ID from the request body
    try {
        const result = await sql`SELECT * FROM dummy_data WHERE id = ${id}`;
        if (result.length === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(result[0]); // Send the first item back as JSON
    } catch (error) {
        console.error('Error querying the database:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to get all items in the dummy_data table (GET)
app.get('/query', async (req, res) => {
    try {
        const result = await sql`SELECT * FROM dummy_data`;
        res.json(result); // Send the result as a JSON response
    } catch (error) {
        console.error('Error querying the database:', error);
        res.status(500).send('Internal Server Error'); // Send an error response
    }
});

// Route to update the note
app.put('/update-note', async (req, res) => {
    const { id, note } = req.body; // Get ID and new note from the request body
    try {
        const result = await sql`UPDATE dummy_data SET note = ${note} WHERE id = ${id}`;
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Note updated successfully' });
    } catch (error) {
        console.error('Error updating the note:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Root route
app.get('/', (req, res) => {
    res.send('<h1>Welcome to backend server!</h1>');
});

// Version route
app.get('/version', requestHandler);

// Start the server
const port = 5432;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
