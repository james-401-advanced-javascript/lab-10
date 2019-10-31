'use strict';

// == EXTERNAL RESOURCES ===============================================

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// == DEFINE THE USER SCHEMA =============================================

// TODO Comment
const users = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
  role: {
    type: String,
    required: true,
    default: 'user',
    enum: ['admin', 'editor', 'user']
  }
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
users.statics.authenticate = function(creds) {
  let query = { username: creds.username };

  return this.findOne(query)
    .then(user => user && user.comparePassword(creds.password))
    .catch(console.error);
};

// TODO JSDocs Comment
// TODO Convert this function into using async/await
users.methods.comparePassword = function(password) {
  return bcrypt
    .compare(password, this.password)
    .then(valid => (valid ? this : null));
};

// TODO JSDocs Comment
users.methods.generateToken = function() {
  let tokenData = { id: this._id };
  return jwt.sign(tokenData, process.env.SECRET || 'this-is-my-secret');
};

module.exports = mongoose.model('users', users);
