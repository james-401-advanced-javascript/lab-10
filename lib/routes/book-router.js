'use strict';

const express = require('express');
const router = express.Router();
const Users = require('../models/users-model');
let user = new Users();

let books = [
  { title: 'Brave New World', auth: ['admin'] },
  { title: 'Hamlet', auth: ['admin', 'editor'] },
  { title: 'Alice in Wonderland', auth: ['admin', 'editor', 'user'] },
];

/**
 * @route GET /books
 * @return {200} - Successfull connection
 * @return {object} - library
 * Upon receiving a get request from client, return books and number of books in json object
 */
// TODO Edit code (see lab README)
router.get('/books', async (req, res, next) => {
  // What users looks like
  /* 
  { 
    "_id" : ObjectId("5db89b624eecc5418a3bf3c3"), 
    "role" : "user", 
    "username" : "rene", 
    "password" : "$2b$10$S.Vh0rsjdQ.PgKaOkkkeuOwFkn8uQlGiKalsiFrcQmI13pChxCC7y", 
    "email" : "rene@email.com", 
    "__v" : 0 
  }
   */
  console.log('REQUEST OBJECT: ', req.body);
  let authenticatedUser = await user.authenticate(req.body);
  console.log('Authenticated OBJECT: ', authenticatedUser);
  let library = {
    count: books.length,
    results: books,
  };
  if (!authenticatedUser) {
    res.status(403).send('Must be logged in to view library');
  } else {
    let filteredBooks = books.filter(book => {
      return book.auth.filter(authInfo => authInfo === authenticatedUser.role);
    });
    library.count = filteredBooks.length;
    library.results = filteredBooks;
    res.status(200).json(library);
  }
});

/**
 * @route GET /books/:indx
 * @return {200} - Successfull connection
 * @return {object} - library
 * Upon receiving a get request from client, return individual book by index number in json object
 * If index in url is less than books.length, then return the book at that index position
 */
// TODO Edit code (see lab README)
router.get('/books/:indx', async (req, res, next) => {
  if (req.params.indx < books.length) {
    let book = books[req.params.indx];
    // If no author return error forcing login
    // If book doesn't match use role, return 403 error
    // If book auth matches user role, then show book
    // otherwise send error
    let authenticatedUser = await user.authenticate(req.body);
    console.log('WHO DAT: ', authenticatedUser);
    if (!req.body) {
      res.status(403).send('Must be logged in as user');
    } else {
      if (
        book.auth.filter(authInfo => authInfo === authenticatedUser.role)
          .length === 0
      ) {
        res.status(403).send('Access Denied');
      } else {
        res.status(200).json(book);
      }
    }
    // res.status(200).json(book);
  } else {
    res.send('Book not Found');
  }
});

module.exports = router;
