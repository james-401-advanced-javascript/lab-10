'use strict';

// == EXTERNAL RESOURCES ===============================================

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// == DEFINE THE USER SCHEMA =============================================

// Create new instance of user model
const users = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
  role: {
    type: String,
    required: true,
    default: 'user',
    enum: ['admin', 'editor', 'user'],
  },
});

/**
 * This middleware function function runs before every save to the users collection in mongodb
 * @param {string} method
 * @param {function} callback
 */
users.pre('save', async function() {
  // TODO README Question
  // What does .isModified do and why do we use it?
  // If the password has been modified/set
  // hash password before storing entry in db
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

/**
 * @param {object} creds
 * @returns {boolean} true if username and password match, false if not
 * This function receives the username and password through the creds argument passed in
 * Search for username in db and compare password in db with password from creds if user is found
 */
// TODO Convert this function into using async/await
users.statics.authenticate = async function(creds) {
  let query = { username: creds.username };

  try {
    let user = await this.findOne(query);
    return user && user.comparePassword(creds.password);
    // .then(user => user && user.comparePassword(creds.password))
  } catch (e) {
    console.error(e);
  }
};

// TODO JSDocs Comment
/**
 * @param {string} password
 * @returns object if password is valid, null if not valid
 * This function encripts the password string and compares it to the encrypted password in the db
 */
// TODO Convert this function into using async/await
users.methods.comparePassword = async function(password) {
  let validPassword = await bcrypt.compare(password, this.password);
  return validPassword ? this : null;
  // .then(valid => (valid ? this : null));
};

/**
 * @returns {object} signed jwt token
 * This function is signing the jwt token with the server's secret
 * The client is identified by its _id
 */
users.methods.generateToken = function() {
  let tokenData = { id: this._id };
  return jwt.sign(tokenData, process.env.SECRET || 'this-is-my-secret');
};

module.exports = mongoose.model('users', users);
