// models/book.model.js — NEW for 5.2C
// Schema defines shape and types. Decimal128 for money; getter converts to a plain number for JSON.
const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    summary: { type: String, required: true },
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      get: (v) => (v ? parseFloat(v.toString()) : v),
    },
  },
  {
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

module.exports = mongoose.model('Book', BookSchema);
