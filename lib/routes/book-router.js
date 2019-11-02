'use strict';

const express = require('express');
const router = express.Router();

let books = [
  { title: 'Brave New World', auth: ['admin'] },
  { title: 'Hamlet', auth: ['admin', 'editor'] },
  { title: 'Alice in Wonderland', auth: ['admin', 'editor', 'user'] },
];


/**
 * @route GET /books
 * @returns {200} - Successfull connection
 * @returns {object} - library
 * Upon receiving a get request from client, return books and number of books in json object
 */
// TODO Edit code (see lab README)
router.get('/books', (req, res, next) => {
  let library = {
    count: books.length,
    results: books,
  };
  res.status(200).json(library);
});

/**
 * @route GET /books/:indx
 * @returns {200} - Successfull connection
 * @returns {object} - library
 * Upon receiving a get request from client, return books and number of books in json object
 */
// TODO Edit code (see lab README)
router.get('/books/:indx', (req, res, next) => {
  if (req.params.indx < books.length) {
    let book = books[req.params.indx];
    res.status(200).json(book);
  } else {
    res.send('Book not Found');
  }
});

module.exports = router;
