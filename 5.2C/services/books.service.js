// services/books.service.js

// Data Access Only
// queries the DB and returns plain objects/documents.
const Book = require('../models/book.model');

// Service functions to retrieve books data
// Get all books
const getAllBooks = async () => {
  return Book.find({});
};

// Get a book by ID
const getBookById = async (id) => {
  return Book.findOne({ id });
};

module.exports = { getAllBooks, getBookById };
