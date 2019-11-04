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
 * @return {res}
 */
// Changing create and authenticate functions from async to promises
// Reason: To get rid of atomic race condition eslint errors
// More info on eslint error: https://eslint.org/docs/rules/require-atomic-updates
const create = (req, res, next) => {
  // let userCheck = users
  //   .getFromField(req.body.username)
  //   .then(entry => {
  //     if (entry) {
  //       console.log('IN THE FUNCTION: ', entry);
  //       return entry;
  //     } else {
  //       next();
  //     }
  //   })
  //   .catch(e => console.error(e));
  return users
    .create(req.body)
    .then(user => {
      if (user && user._id) {
        req.user = user;
      } else {
        req.user = null;
      }
      next();
    })
    .catch(e => console.error(e));
};

/**
 * This function authenticates the user input from req.dody against info stored in mongo db document
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
const authenticate = (req, res, next) => {
  return users
    .authenticate(req.body)
    .then(user => {
      if (user && user._id) {
        req.user = user;
      } else {
        req.user = null;
      }
      next();
    })
    .catch(e => console.error(e));
};

const setToken = (req, res, next) => {
  if (req.user) {
    let token = req.user.generateToken();

    // Set token property on respone object to recently generated jwt token
    res.set('token', token);

    // Store jwt token in cookie to send to client's browser
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
