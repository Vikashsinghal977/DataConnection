const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 5000;

// Middleware to parse JSON data
app.use(bodyParser.json());

// Serve static HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle form submission
app.post('/submit', async (req, res) => {
    const formData = req.body;

    try {
        // Connect to MongoDB
        const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db('formApp');

        // Insert data into the database
        const result = await db.collection('submissions').insertOne(formData);

        // Close the database connection
        client.close();

        // Send success response
        res.json({ success: true, id: result.insertedId });
    } catch (error) {
        console.error('Error:', error);
        res.json({ success: false, error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
