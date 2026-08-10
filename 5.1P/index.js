// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from 'public_html' folder
app.use(express.static(path.join(__dirname, 'public_html')));
app.use(express.json());

// Mount the books route at /api/books
const booksRoute = require('./routes/books.routes');
app.use('/api/books', booksRoute);

// Redirect root to index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public_html', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Open your browser and go to: http://localhost:${PORT}`);
});
