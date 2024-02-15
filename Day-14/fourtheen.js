const express = require('express');
const app = express();

// Caching middleware implementation
function cachingMiddleware(req, res, next) {
    const cacheKey = req.originalUrl || req.url;

    if (cache[cacheKey]) {
        // If cached response exists, send it
        res.json(cache[cacheKey]);
    } else {
        // Store the original res.json function
        res.originalJson = res.json;

        // Override res.json to cache the response before sending
        res.json = function (data) {
            cache[cacheKey] = data; // Cache the response
            res.originalJson(data); // Call the original res.json function
        };

        next(); // Call the next middleware
    }
}

// API route with caching middleware
app.get('/api/data', cachingMiddleware, (req, res) => {
    res.json({ data: 'Hello, world!' });
});

const cache = {};
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
