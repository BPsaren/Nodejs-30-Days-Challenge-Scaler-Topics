require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

const mongoURI = process.env.mongoDB_URI;

// Define the Mongoose schema for the "User"
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true }
});

// Create a Mongoose model for the User schema
const User = mongoose.model('User', userSchema);

function connectToMongoDB() {
  mongoose.connect(mongoURI)
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch(error => console.error('MongoDB connection error:', error));
}

connectToMongoDB();

// Function to retrieve all users from MongoDB and return them as JSON
function getAllUsers(req, res) {
  User.find()
    .then(users => res.json(users))
    .catch(error => res.status(500).json({ error: 'Error retrieving users from the database' }));
}

// Route to handle requests to /users and retrieve all users
app.get('/users', getAllUsers);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
