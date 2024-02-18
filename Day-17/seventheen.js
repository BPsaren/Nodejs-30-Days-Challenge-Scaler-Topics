const express = require('express');
const mongoose = require('mongoose');

// Initialize Express
const app = express();

// Define the Mongoose schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String
});

// Create the Mongoose model
const User = mongoose.model('User', userSchema);

// Connect Mongoose to your MongoDB database
mongoose.connect('mongodb://127.0.0.1/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

// Function to add a new user to the MongoDB database
async function addUserToDatabase(user) {
  try {
    // Create a new User object using the provided user data
    const newUser = new User(user);
    
    // Save the user to the database
    await newUser.save();
    
    console.log("User added successfully");
  } catch (error) {
    console.error("Error adding user:", error);
  }
}

// Add route to handle adding a new user
app.post('/users', (req, res) => {
  const { username, email } = req.body;
  addUserToDatabase({ username, email });
  res.send('User added successfully');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
