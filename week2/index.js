// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from 'public_html' folder
app.use(express.static(path.join(__dirname, 'public_html')));

// Middleware to parse JSON bodies (for POST requests)
app.use(express.json());

// Optional: Redirect root to index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public_html', 'index.html'));
});

// In-memory array to store quotes
let quotes = [
    "The best way to predict the future is to invent it.",
    "Life is 10% what happens to us and 90% how we react to it.",
    "The only limit to our realization of tomorrow is our doubts of today.",
    "Do not wait to strike till the iron is hot; but make it hot by striking."
];

//Example 1
// GET endpoint to retrieve a random quote
// Usage example: http://localhost:3000/api/quote
app.get('/api/quote', (req, res) => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    res.json({ quote: randomQuote });
});

// POST endpoint to add a new quote
// Usage example: http://localhost:3000/api/quote
// Request body should be JSON: { "quote": "Your new quote here" }
app.post('/api/quote', (req, res) => {
    const newQuote = req.body.quote;
    if (newQuote && typeof newQuote === 'string') {
        quotes.push(newQuote);
        res.status(201).json({ message: 'Quote added successfully!', quote: newQuote });
    } else {
        res.status(400).json({ message: 'Invalid quote. Please provide a valid string.' });
    }
});

// Example 2
// Define a GET endpoint at '/square' that calculates the square of a number.
// The endpoint expects a query parameter 'num', e.g., /square?num=5
app.get('/square', (req, res) => {
    // Extract the 'num' query parameter from the request and convert it to a floating point number.
    const num = parseFloat(req.query.num);
    // Check if 'num' is not a valid number. If it's not, send an error message as the response.
    if (isNaN(num)) {
        return res.send("Error: Please provide a valid number using query parameter 'num'.");
    }
    // Calculate the square of the number.
    const square = num * num;
    // Send a plain text response showing the result.
    res.send(`The square of ${num} is: ${square}`);
});

// Task 2.2P
// Create a GET endpoint at /sum
app.get('/sum', (req, res) => {
    // Parse the numbers from the query parameters
    const a = parseFloat(req.query.a);
    const b = parseFloat(req.query.b);
    // Calculate the sum
    const sum = a + b;
    // Send a plain text response showing the result
    res.send(`The sum of ${a} and ${b} is: ${sum}`);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Open your browser and go to: http://localhost:${PORT}`);
});