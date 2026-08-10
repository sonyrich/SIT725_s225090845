// controllers/books.controller.js — bridges routes and services
const booksService = require('../services/books.service');

// Controller functions to handle requests and responses
exports.getAllBooks = (req, res) => {
  const books = booksService.getAllBooks();
  res.json({ statusCode: 200, data: books, message: "Success" });
};

// Controller function to get a book by ID
exports.getBookById = (req, res) => {
  const book = booksService.getBookById(req.params.id);
  if (!book) {
    return res.status(404).json({ statusCode: 404, data: null, message: "Book not found" });
  }
  res.json({ statusCode: 200, data: book, message: "Success" });
};
