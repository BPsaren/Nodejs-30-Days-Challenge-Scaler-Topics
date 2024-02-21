require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

const mongoURI = process.env.mongoDB_URI;

// Define the Mongoose schema for the "User" with validation for the email property
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { 
    type: String, 
    required: true,
    validate: {
      validator: function(value) {
        // Regular expression for email validation
        return /\S+@\S+\.\S+/.test(value);
      },
      message: 'Invalid email address'
    }
  },
  age: { type: Number, required: true }
});

// Create a Mongoose model for the User schema
const User = mongoose.model('User', userSchema);

function connectToMongoDB() {
  mongoose.connect(mongoURI)
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch(error => console.error('MongoDB connection error:', error));
}

connectToMongoDB();

// Function to add a new user to the MongoDB database with validation
function addUserWithValidation(user) {
  const newUser = new User(user);
  newUser.save()
    .then(() => console.log('User added successfully'))
    .catch(error => console.error('Error adding user:', error.message));
}

// Route to handle requests to /users and retrieve all users
app.get('/users', (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(error => res.status(500).json({ error: 'Error retrieving users from the database' }));
});

// Example route to test adding a new user with validation
app.get('/addUserWithValidation', (req, res) => {
  addUserWithValidation({ username: 'john_doe', email: 'iohn@example.id-email', age: 25 });
  res.send('New user added with validation!');
});

// Express route to calculate the average age of all users in MongoDB
function averageAgeOfUsers(req, res) {
  User.aggregate([
    {
      $group: {
        _id: null,
        averageAge: { $avg: "$age" }
      }
    }
  ])
  .then(result => {
    if (result.length > 0) {
      res.json({ averageAge: result[0].averageAge });
    } else {
      res.json({ averageAge: 0 });
    }
  })
  .catch(error => res.status(500).json({ error: 'Error calculating average age' }));
}

// Route to handle requests to /average-age and calculate the average age of all users
app.get('/average-age', averageAgeOfUsers);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
