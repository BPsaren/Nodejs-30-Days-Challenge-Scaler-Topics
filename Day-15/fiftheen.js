const express = require('express');
const app = express();

// Define logging middleware
app.use((req, res, next) => {
  // Get current timestamp
  const timestamp = new Date().toISOString();

  // Log request details
  console.log(`[${timestamp}]`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);

  // Call next middleware
  next();
});

// Define your routes and other middleware as needed

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
