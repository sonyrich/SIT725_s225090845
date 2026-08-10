// services/books.service.js

// Data Access Only
// queries the DB and returns plain objects/documents.
const Book = require('../models/book.model');

const CREATE_FIELDS = ['id', 'title', 'author', 'year', 'genre', 'summary', 'price'];
const UPDATE_FIELDS = ['title', 'author', 'year', 'genre', 'summary', 'price'];

// Helper functions for validation and sanitization
function createBadRequest(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

// Rejects unknown fields in the payload that are not in the allowedFields array.
function rejectUnknownFields(payload, allowedFields) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw createBadRequest('Request body must be a JSON object');
  }

  const unknownFields = Object.keys(payload).filter(
    (field) => !allowedFields.includes(field)
  );

  if (unknownFields.length > 0) {
    throw createBadRequest(`Unexpected field(s): ${unknownFields.join(', ')}`);
  }
}

// Picks only the allowed fields from the payload to create a safe object for database operations.
function pickFields(payload, allowedFields) {
  return allowedFields.reduce((safePayload, field) => {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      safePayload[field] = payload[field];
    }
    return safePayload;
  }, {});
}

// Service functions for CRUD operations on books
exports.getAllBooks = async () => {
  return Book.find({}).sort({ title: 1 });
};

// Retrieves a single book by its unique id.
exports.getBookById = async (id) => {
  return Book.findOne({ id });
};

// Creates a new book document in the database after validating the payload.
exports.createBook = async (payload) => {
  rejectUnknownFields(payload, CREATE_FIELDS);

  const safeBook = pickFields(payload, CREATE_FIELDS);
  const book = new Book(safeBook);

  await book.validate();
  return book.save();
};

// Updates an existing book document by its unique id with the provided payload.
exports.updateBook = async (id, payload) => {
  if (
    payload &&
    Object.prototype.hasOwnProperty.call(payload, 'id')
  ) {
    throw createBadRequest('id is immutable and cannot be included in an update request');
  }

  rejectUnknownFields(payload, UPDATE_FIELDS);

  if (Object.keys(payload).length === 0) {
    throw createBadRequest('At least one updatable field is required');
  }

  const existingBook = await Book.findOne({ id });

  if (!existingBook) {
    return null;
  }

  const safeUpdate = pickFields(payload, UPDATE_FIELDS);

  // Validate a full candidate document before writing.
  const candidate = new Book({
    id: existingBook.id,
    title: Object.prototype.hasOwnProperty.call(safeUpdate, 'title')
      ? safeUpdate.title
      : existingBook.title,
    author: Object.prototype.hasOwnProperty.call(safeUpdate, 'author')
      ? safeUpdate.author
      : existingBook.author,
    year: Object.prototype.hasOwnProperty.call(safeUpdate, 'year')
      ? safeUpdate.year
      : existingBook.year,
    genre: Object.prototype.hasOwnProperty.call(safeUpdate, 'genre')
      ? safeUpdate.genre
      : existingBook.genre,
    summary: Object.prototype.hasOwnProperty.call(safeUpdate, 'summary')
      ? safeUpdate.summary
      : existingBook.summary,
    price: Object.prototype.hasOwnProperty.call(safeUpdate, 'price')
      ? safeUpdate.price
      : existingBook.price
  });

  await candidate.validate();

  return Book.findOneAndUpdate(
    { id },
    { $set: safeUpdate },
    {
      new: true,
      runValidators: true,
      context: 'query'
    }
  );
};