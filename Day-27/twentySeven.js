// Import necessary modules
import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';

// Sample user data (replace it with your user data retrieval logic)
const users = {
    'user123': { id: 'user123', username: 'john_doe', role: 'admin' },
    'user456': { id: 'user456', username: 'jane_doe', role: 'user' }
};

// Secret key for JWT (replace it with your secret key)
const secretKey = "day_27.js";

// Authentication and Authorization Middleware
export function authenticateAndAuthorize(req, res, next) {
    const token = req.headers.authorization;

    console.log('Token:', token);

    if (!token) {
        console.log('Unauthorized - Token not provided');
        return res.status(401).json({ error: 'Unauthorized - Token not provided' });
    }

    try {
        // Verify the token using the secret key
        const decodedToken = jwt.verify(token, secretKey);

        // Attach user information to the request object
        req.user = users[decodedToken.userId];

        console.log('Decoded Token:', decodedToken);
        console.log('User:', req.user);

        // Check if the user has the required role
        if (!req.user || !hasRequiredRole(req.user.role)) {
            console.log('Forbidden - Insufficient permissions');
            return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
        }

        // If authentication and authorization passed, proceed to the next middleware or route handler
        console.log('Authentication and Authorization passed');
        next();
    } catch (error) {
        console.log('Unauthorized - Invalid token');
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
}

// Helper function to check if the user has the required role
function hasRequiredRole(userRole) {
    // Replace it with your role-checking logic
    return userRole === 'admin';
}

// Create an Express app
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Login route to simulate user login and generate a token
app.post('/login', (req, res) => {
    const { userId } = req.body;

    // Validate userId (you may want to add more validation logic)
    if (!userId || !users[userId]) {
        return res.status(401).json({ error: 'Invalid user ID' });
    }

    // Generate a token for the user
    const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' });

    res.json({ token });
});
// Sample public route
app.get('/public', (req, res) => {
    res.json({ message: 'Public route - No authentication required' });
});

// Sample protected route using the authentication middleware
app.get('/protected', authenticateAndAuthorize, (req, res) => {
    res.json({ message: 'Protected route - Authentication and authorization passed' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});