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

// TODO JSDocs Comment
users.pre('save', async function() {
  // TODO README Question
  // What does .isModified do and why do we use it?
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// TODO JSDocs Comment
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
// TODO Convert this function into using async/await
users.methods.comparePassword = async function(password) {
  let validPassword = await bcrypt.compare(password, this.password);
  return validPassword ? this : null;
  // .then(valid => (valid ? this : null));
};

// TODO JSDocs Comment
users.methods.generateToken = function() {
  let tokenData = { id: this._id };
  return jwt.sign(tokenData, process.env.SECRET || 'this-is-my-secret');
};

module.exports = mongoose.model('users', users);
