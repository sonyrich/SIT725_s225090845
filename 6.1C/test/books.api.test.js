// test/books.api.test.js
// Integration tests for the REST API endpoint(s) in routes/books.routes.js
// (mounted at /api/books in index.js).
//
// IMPORTANT setup steps before running:
// 1. npm install --save-dev mocha chai chai-http
// 2. At the bottom of index.js add:  module.exports = app;
// 3. Make sure MongoDB is running locally and reachable at the connection
//    string used in index.js, since these tests hit real Mongoose routes.

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const app = require('../index');

describe('Books REST API (/api/books)', () => {

  const validBook = {
    id: 'test-book-' + Date.now(),
    title: 'The Pragmatic Tester',
    author: 'Jane Dev',
    year: 2024,
    genre: 'Non-fiction',
    summary: 'A book about writing good tests.',
    price: 29.99
  };

  it('VALID: POST /api/books creates a new book and returns 201', async () => {
    const res = await chai.request(app)
      .post('/api/books')
      .send(validBook);

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('data');
    expect(res.body.data).to.have.property('title', validBook.title);
  });

  it('INVALID: POST /api/books without required fields returns 400', async () => {
    const res = await chai.request(app)
      .post('/api/books')
      .send({ genre: 'Missing required fields' }); // no id/title/author/year

    expect(res).to.have.status(400);
  });

  it('VALID: GET /api/books/:id returns the book that was just created', async () => {
    const res = await chai.request(app).get(`/api/books/${validBook.id}`);

    expect(res).to.have.status(200);
    expect(res.body.data).to.have.property('id', validBook.id);
  });

  it('EDGE CASE: GET /api/books/:id with a non-existent id returns 404', async () => {
    const res = await chai.request(app).get('/api/books/this-id-does-not-exist-999');

    expect(res).to.have.status(404);
  });

});
