const express = require('express');
const app = express();


// initialize the port we are listening on and let us ping it
const port = process.env.PORT || 3000; // You can use environment variables for port configuration
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


app.get('/', (req, res) => {
    res.send('<h1>Welcome to backend server!</h1>');
});