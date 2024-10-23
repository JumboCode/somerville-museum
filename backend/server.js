require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Import cors
const { neon } = require("@neondatabase/serverless");

const app = express();
const sql = neon(process.env.DATABASE_URL);

app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // To parse JSON request bodies

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

// Other routes...

const port = 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
