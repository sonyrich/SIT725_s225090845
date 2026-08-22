// server.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB URI
mongoose.connect('mongodb://localhost:27017/booksDB');

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB!');
});
mongoose.connection.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Serve static files from 'public_html' folder
app.use(express.static(path.join(__dirname, 'public_html')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mount the books route at /api/books
const booksRoute = require('./routes/books.routes');
app.use('/api/books', booksRoute);

app.get('/api/integrity-check42', (req, res) => {
    res.status(204).send();
});

// Redirect root to index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public_html', 'index.html'));
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Open your browser and go to: http://localhost:${PORT}`);
});

module.exports = server;