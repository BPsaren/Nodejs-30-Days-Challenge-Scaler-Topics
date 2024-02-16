const express = require('express');
const mongoose = require('mongoose');

const app = express();

// MongoDB connection string
const mongoURI = 'mongodb://127.0.0.1/mydatabase';

/**
 * Establishes a connection to MongoDB using Mongoose
 */
function connectToMongoDB() {
  mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

  const db = mongoose.connection;

  db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  db.once('open', () => {
    console.log('Successfully connected to MongoDB');
  });
}

// Call the function to connect to MongoDB
connectToMongoDB();

// Example route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
