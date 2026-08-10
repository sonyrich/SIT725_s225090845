// controllers/books.controller.js
const booksService = require('../services/books.service');

// Controller function to get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await booksService.getAllBooks();
    res.json({ statusCode: 200, data: books, message: 'Success' });
  } catch (err) {
    res.status(500).json({ statusCode: 500, data: null, message: err.message });
  }
};

// Controller function to get a book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await booksService.getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ statusCode: 404, data: null, message: 'Book not found' });
    }
    res.json({ statusCode: 200, data: book, message: 'Success' });
  } catch (err) {
    res.status(500).json({ statusCode: 500, data: null, message: err.message });
  }
};
