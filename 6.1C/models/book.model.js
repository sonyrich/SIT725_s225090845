// models/book.model.js
// Schema defines shape and types.
// Decimal128 for money.
// getter converts to a plain number for JSON.
const mongoose = require('mongoose');

const currentYear = () => new Date().getFullYear();

const bookSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'id is required'],
      unique: true,
      trim: true,
      match: [/^[A-Za-z0-9-]{1,40}$/, 'id must be 1 to 40 letters, numbers, or hyphens'],
      immutable: true
    },
    title: {
      type: String,
      required: [true, 'title is required'],
      trim: true,
      minlength: [1, 'title must contain at least 1 character'],
      maxlength: [150, 'title cannot exceed 150 characters']
    },
    author: {
      type: String,
      required: [true, 'author is required'],
      trim: true,
      minlength: [2, 'author must contain at least 2 characters'],
      maxlength: [100, 'author cannot exceed 100 characters']
    },
    year: {
      type: Number,
      required: [true, 'year is required'],
      validate: {
        validator: (value) =>
          Number.isInteger(value) && value >= 1450 && value <= currentYear(),
        message: () => `year must be a whole number from 1450 to ${currentYear()}`
      }
    },
    genre: {
      type: String,
      required: [true, 'genre is required'],
      trim: true,
      minlength: [2, 'genre must contain at least 2 characters'],
      maxlength: [50, 'genre cannot exceed 50 characters']
    },
    summary: {
      type: String,
      required: [true, 'summary is required'],
      trim: true,
      minlength: [10, 'summary must contain at least 10 characters'],
      maxlength: [1000, 'summary cannot exceed 1000 characters']
    },
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: [true, 'price is required'],
      validate: {
        validator: (value) => {
          if (value == null) return false;
          const numericValue = Number(value.toString());
          return Number.isFinite(numericValue) && numericValue >= 0;
        },
        message: 'price must be a non-negative AUD amount'
      }
    }
  },
  {
    strict: 'throw',
    versionKey: false,
    toJSON: {
      transform: (_document, returnedObject) => {
        if (returnedObject.price != null) {
          returnedObject.price = returnedObject.price.toString();
        }
        return returnedObject;
      }
    }
  }
);

module.exports = mongoose.model('Book', bookSchema);