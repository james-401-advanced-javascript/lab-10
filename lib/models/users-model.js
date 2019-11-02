'use strict';

const Model = require('./model.js');
const schema = require('./users-schema.js');

class Users extends Model {
  constructor() {
    super(schema);
  }

  /**
   * This function authenticates the user by:
   * 1. Finding username in db
   * 2. Comparing password to user password in db
   * @param {object} creds
   * @return {object} authenticated user
   */
  authenticate(creds) {
    return this.schema.authenticate(creds);
  }
}

module.exports = Users;
