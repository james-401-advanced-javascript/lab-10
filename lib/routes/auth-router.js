'use strict';

const express = require('express');
const router = express.Router();

const Users = require('../models/users-model.js');
const users = new Users();

/**
 * This function creates a new entry in the users mongo collection
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @param {object} req.body
 * @returns {res}
 */
// Changing create and authenticate functions from async to promises
// Reason: To get rid of atomic race condition eslint errors
// More info on eslint error: https://eslint.org/docs/rules/require-atomic-updates
const create = (req, res, next) => {
  // let user = await users.create(req.body);
  // req.user = user && user._id ? user : null;
  users
    .create(req.body)
    .then(data => {
      req.user = data && data._id ? data : null;
    })
    .catch(e => console.error(e));

  next();
};

/**
 * This function authenticates the user input from req.dody against info stored in mongo db document
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
const authenticate = (req, res, next) => {
  // let user = await users.authenticate(req.body);
  // req.user = user && user._id ? user : null;
  users
    .authenticate(req.body)
    .then(data => {
      req.user = data && data._id ? data : null;
    })
    .catch(e => console.error(e));

  next();
};

// TODO README Question
// Currently, the client is just sending us an object
// containing the username and password to us, which is
// why we can just pass along (req.body). What is a
// better way to do this?

const setToken = (req, res, next) => {
  if (req.user) {
    let token = req.user.generateToken();

    // Set token property on respone object to recently generated jwt token
    res.set('token', token);

    // Store jwt token in cookie to send to client's browser
    // TODO README Question
    // What are the pros and cons of setting res.cookie?
    /*
      Pros:
          We can store only the token key in the cookie rather than user data
          The user won't have to continually re-login as long as his/her token is valid
      Cons:
          Storing token data in cookies leaves the server open to CSRF attacks
    */
    res.cookie('token', token);

    res.send('Successfully authenticated and logged in');
  } else res.send('Unable to authenticate and log in');
};

/**
 * @route POST /signup
 * @funciton create
 * saves entry in mongo db
 * @function {setToken}
 * sets token to be sent back to client
 */
router.post('/signup', create, setToken);

/**
 * @route POST /signin
 * @funciton {authenticate} - authenticate user
 * @function {setToken} - setToken to be sent back to client
 */
router.post('/signin', authenticate, setToken);

module.exports = router;
