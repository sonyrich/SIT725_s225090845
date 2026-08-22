// routes/books.routes.js
const express = require('express');
const booksController = require('../controllers/books.controller');

const router = express.Router();

// Get all books and get a book by ID
router.get('/', booksController.getAllBooks);
router.get('/:id', booksController.getBookById);

// Create a new book and update an existing book
router.post('/', booksController.createBook);
router.put('/:id', booksController.updateBook);

module.exports = router;
