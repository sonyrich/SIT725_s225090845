// routes/books.routes.js
const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books.controller');

// NO business logic here, only route
router.get('/', booksController.getAllBooks);
router.get('/:id', booksController.getBookById);

module.exports = router;
