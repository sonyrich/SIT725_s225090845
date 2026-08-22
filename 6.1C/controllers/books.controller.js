// controllers/books.controller.js
const booksService = require('../services/books.service');

// Controller function to get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await booksService.getAllBooks();

    return res.status(200).json({
      statusCode: 200,
      developedBy: 's225090845',
      data: books
    });
  } catch (error) {
    return sendError(res, error);
  }
};

// Controller function to get a book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await booksService.getBookById(req.params.id);

    // If the book is not found, return a 404 response
    if (!book) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Book not found'
      });
    }

    // If the book is found, return it in the response
    return res.status(200).json({
      statusCode: 200,
      developedBy: 's225090845',
      data: book
    });
  } catch (error) {
    return sendError(res, error);
  }
};

// Controller function to create a new book
exports.createBook = async (req, res) => {
  try {
    const createdBook = await booksService.createBook(req.body);

    return res.status(201).json({
      statusCode: 201,
      message: 'Book created successfully',
      developedBy: 's225090845',
      data: createdBook
    });
  } catch (error) {
    return sendError(res, error);
  }
};

// Controller function to update an existing book
exports.updateBook = async (req, res) => {
  try {
    const updatedBook = await booksService.updateBook(req.params.id, req.body);

    if (!updatedBook) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Book not found'
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: 'Book updated successfully',
      developedBy: 's225090845',
      data: updatedBook
    });
  } catch (error) {
    return sendError(res, error);
  }
};

// Helper function to send error responses based on the type of error
function sendError(res, error) {
  // Handle custom errors with a statusCode property
  if (error.statusCode === 400) {
    return res.status(400).json({
      statusCode: 400,
      message: error.message
    });
  }

  // Handle Mongoose validation errors and duplicate key errors
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({
      statusCode: 400,
      message: error.message
    });
  }

  // Handle duplicate key error (e.g., unique constraint violation)
  if (error.code === 11000) {
    return res.status(409).json({
      statusCode: 409,
      message: 'A book with this id already exists'
    });
  }

  console.error(error);

  return res.status(500).json({
    statusCode: 500,
    message: 'Internal server error'
  });
}
