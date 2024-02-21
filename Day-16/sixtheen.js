require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

const mongoURI = process.env.mongoDB_URI;

function connectToMongoDB() {
  mongoose.connect(mongoURI)
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch(error => console.error('MongoDB connection error:', error));
}

connectToMongoDB();

app.get('/', (req, res) => {
  res.send('30 days nodejs');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
