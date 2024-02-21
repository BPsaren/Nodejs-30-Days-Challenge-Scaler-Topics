require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

const mongoURI = process.env.mongoDB_URI;

// Define the Mongoose schema for the "User"
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
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

// Implement the function to add a new user to the MongoDB database
function addUserToDatabase(user) {
  const newUser = new User(user);
  newUser.save()
    .then(() => console.log('User added successfully'))
    .catch(error => console.error('Error adding user:', error));
}

// Example route to test adding a new user
app.get('/addUser', (req, res) => {
  addUserToDatabase({ username: 'John Doe', email: 'john@example.com', age: 30 });
  addUserToDatabase({ username: 'Alice Smith', email: 'alice@example.com', age: 25 });
  addUserToDatabase({ username: 'Bob Johnson', email: 'bob@example.com', age: 35 });
  addUserToDatabase({ username: 'Emily Brown', email: 'emily@example.com', age: 28 });
  addUserToDatabase({ username: 'Michael Davis', email: 'michael@example.com', age: 40 });
  res.send('New users added!');
});

app.get('/', (req, res) => {
  res.send('30 days nodejs');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
