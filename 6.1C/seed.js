// seed.js
// Populates MongoDB data with AUD price (Decimal128).
const mongoose = require('mongoose');
const Book = require('./models/book.model');

mongoose.connect('mongodb://localhost:27017/booksDB');

const books = [
  {
    id: 'b1',
    title: 'The Three-Body Problem',
    author: 'Liu Cixin',
    year: 2008,
    genre: 'Science Fiction',
    summary:
      "The Three-Body Problem is the first novel in the Remembrance of Earth's Past trilogy. The series portrays a fictional past, present, and future wherein Earth encounters an alien civilization from a nearby system of three Sun-like stars orbiting one another, a representative example of the three-body problem in orbital mechanics.",
    price: mongoose.Types.Decimal128.fromString('24.99'),
  },
  {
    id: 'b2',
    title: 'Jane Eyre',
    author: 'Charlotte Brontë',
    year: 1847,
    genre: 'Classic',
    summary:
      "An orphaned governess confronts class, morality, and love at Thornfield Hall, uncovering Mr. Rochester's secret and forging her own independence.",
    price: mongoose.Types.Decimal128.fromString('15.50'),
  },
  {
    id: 'b3',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    year: 1813,
    genre: 'Classic',
    summary:
      'Elizabeth Bennet and Mr. Darcy navigate pride, misjudgement, and social expectations in a sharp study of manners and marriage.',
    price: mongoose.Types.Decimal128.fromString('12.95'),
  },
  {
    id: 'b4',
    title: 'The English Patient',
    author: 'Michael Ondaatje',
    year: 1992,
    genre: 'Historical Fiction',
    summary:
      'In a ruined Italian villa at the end of WWII, four strangers with intersecting pasts confront memory, identity, and loss.',
    price: mongoose.Types.Decimal128.fromString('18.75'),
  },
  {
    id: 'b5',
    title: 'Small Gods',
    author: 'Terry Pratchett',
    year: 1992,
    genre: 'Fantasy',
    summary:
      'In Omnia, the god Om returns as a tortoise, and novice Brutha must confront dogma, empire, and the nature of belief.',
    price: mongoose.Types.Decimal128.fromString('16.20'),
  },
];

async function seed() {
  const count = await Book.countDocuments({});
  if (count >= 5) {
    console.log('Database already has 5+ books, skipping seed.');
  } else {
    await Book.insertMany(books);
    console.log('Seeded 5 books successfully!');
  }
  mongoose.connection.close();
}

seed();
