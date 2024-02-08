

/**
 * Express route to handle requests with a positive integer parameter
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const express = require('express');
const app = express();

// Express route to handle requests with a positive integer parameter
function positiveIntegerHandler(req, res, next) {
  const number = parseInt(req.query.number);

  // Check if number is a positive integer
  if (Number.isInteger(number) && number > 0) {
    // Return a success message
    return res.status(200).json({ message: 'Success' });
  } else {
    // If number is not a positive integer, trigger an error
    return next(new Error('Number must be a positive integer'));
  }
}

// Error handling middleware to catch specific errors
function errorHandler(err, req, res, next) {
  if (err.message === 'Number must be a positive integer') {
    return res.status(400).json({ error: err.message });
  } else {
    // If the error is not the expected one, pass it to the default error handler
    return next(err);
  }
}

// Using the error handling middleware
app.use(errorHandler);

// Route for handling positive integer requests
app.get('/positive', positiveIntegerHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
