# LAB - 10

## API Server

### Author: James Dunn

### Links and Resources

- [submission PR](https://github.com/james-401-advanced-javascript/lab-10/pull/1)
- [travis](https://travis-ci.com/james-401-advanced-javascript/lab-10)
- [front-end](https://jamesdunn-lab-10.herokuapp.com)

### README Questions

- What does .isModified do and why do we use it?

  - If the password has been modified/set, then hash password before storing entry in db

- What are the pros and cons of setting res.cookie?

  - **Pros**:
    We can store only the token key in the cookie rather than user data
    The user won't have to continually re-login as long as his/her token is valid
  - **Cons**:
    Storing token data in cookies leaves the server open to CSRF attacks

- Currently, the client is just sending us an object containing the username and password to us, which is why we can just pass along (req.body). What is a better way to do this?

  - A better way would be to encode the username and password send them in the header

### Modules

#### `model.js`

#### `users-model.js`

#### `404.js`

#### `error.js`

#### `auth-router.js`

#### `book- router.js`

#### `server.js`

##### Exported Values and Methods

###### `get(_id)`

###### `getFromField(query)`

###### `create(record)`

###### `update(_id, record)`

###### `delete(_id)`

###### `create(req, res, next)`

###### `authenticate(req, res, next)`

###### `setToken(req, res, next)`

###### `handleDelete(req, res, next)`

###### `populateTasks()`

### Setup

#### `.env` requirements

- `PORT` - 3000
- `MONGODB_URI`
- `JWT_SECRET`

#### Running the app

- `npm start`
- Endpoint: `index.js`

#### Tests

- How do you run tests?
- `npm test __tests__/`

#### UML

![UML](./images/lab-10.jpg)
