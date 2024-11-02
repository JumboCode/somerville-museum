
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { neon } = require("@neondatabase/serverless");
const app = express();
const sql = neon(process.env.DATABASE_URL);
const port = process.env.PORT || 5432;

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

app.get('/select', async (req, res) => {
  try {
    console.log(req.query);
      // Query the 'dummy_data' table
      const result = await sql`SELECT * FROM dummy_data WHERE id = ${req.query.id}`;

       // Send the result back to the client
       res.json(result); // Send the result as a JSON response
     } catch (error) {
       console.error('Error querying the database:', error);
       res.status(500).send('Internal Server Error'); // Send an error response
     }
 });

 app.get('/delete', async (req, res) => {
   try {
       // Query the 'dummy_data' table
       const result = await sql`DELETE FROM dummy_data WHERE id = ${req.query.id}`;

       // Send the result back to the client
       res.json(result); // Send the result as a JSON response
     } catch (error) {
       console.error('Error querying the database:', error);
       res.status(500).send('Internal Server Error'); // Send an error response
     }
  });

// // Route to query an item by ID
app.post('/queryone', async (req, res) => {
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


// Example endpoint
app.get('/version', requestHandler);

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

// Route to update the name
app.put('/update-name', async (req, res) => {
  const { id, name } = req.body; // Get ID and new note from the request body
  try {
      const result = await sql`UPDATE dummy_data SET name = ${name} WHERE id = ${id}`;
      
      if (result.rowCount === 0) {
          return res.status(404).json({ message: 'Item not found' });
      }
      res.status(200).json({ message: 'Name updated successfully' });
  } catch (error) {
      console.error('Error updating the name:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.put('/update-id', async (req, res) => {
  const { id, newId, data } = req.body;
  console.error('ID: ', id, ' New ID: ', newId, ' Data: ', data);

  try {
    // Check if the new ID already exists
    const existingRecord = await sql`SELECT * FROM dummy_data WHERE id = ${newId}`;

    if (existingRecord.length > 0) {
      if (newId !== id) {
        // Case 1: New ID already exists, and it's not the same as the current ID
        return res.status(404).json({ message: 'Error: Trying to overwrite an existing ID. Update aborted.' });
      }
      else{
        // Case 2: New ID exists, and it's the same as the current ID (perform update)
        const updateResult = await sql`
        UPDATE dummy_data 
        SET name = ${data.name}, note = ${data.note}, tags = ${data.tags}
        WHERE id = ${id}
      `;
      
        return res.status(200).json({ message: 'ID updated successfully', rowCount: updateResult.rowCount });
      }
    }
    else {
      // Case 3: New ID does not exist (create a new record)
      const insertResult = await sql`
        INSERT INTO dummy_data (id, name, tags, note) 
        VALUES (${newId}, ${data.name}, ${data.tags}, ${data.note})
      `;
      const deleteOld = await sql `DELETE FROM dummy_data WHERE id = ${id}`;

      return res.status(201).json({ message: 'New record created and old record deleted.' });
    }  
  } catch (error) {
    console.error('Error querying the database:', error);
    res.status(500).send('Internal Server Error');
  }
});



// Root route
app.get('/', (req, res) => {
    res.send('<h1>Welcome to backend server!</h1>');
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

app.post('/additembutton', async (req, res) => {
  console.log(req.body);
  const { id, name, note } = req.body;

  try {
      // Query the 'dummy_data' table
      await sql`INSERT INTO dummy_data (id, name, note)
        VALUES (${id}, ${name}, ${note})`;
      
      // Send the result back to the client
      res.json({ message: 'Item added successfully!'}); // Send the result as a JSON response
    } catch (error) {
      console.error(error);
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

app.put('/item/:id/tags', async (req, res) => {
  const { id } = req.params;
  const { tags } = req.body;

  // Debugging statement
  console.log('req.body:', req.body);

  // Ensure tags is an array
  if (!Array.isArray(tags)) {
    return res.status(400).send('Tags must be an array');
  }

  try {
    // Convert the array to a string
    const tagsString = `{${tags.join(',')}}`;

    // Update the 'tag' attribute of the item with the specified ID
    const result = await sql`
      UPDATE dummy_data
      SET tags = ${tagsString}
      WHERE id = ${id}
      RETURNING *;
    `;
    if (result.length === 0) {
      return res.status(404).send('Item not found');
    }
    // Send the updated item back to the client
    res.json(result[0]); // Send the updated item as a JSON response
  } catch (error) {
    console.error('Error updating tags:', error);
    res.status(500).send('Internal Server Error'); // Send an error response
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});