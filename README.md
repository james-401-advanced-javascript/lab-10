# LAB - 10

## API Server

### Author: James Dunn

### Links and Resources

- [submission PR](https://github.com/james-401-advanced-javascript/lab-10/pull/1)
- [travis](https://travis-ci.com/james-401-advanced-javascript/lab-10)
- [front-end](https://jamesdunn-lab-10.herokuapp.com)

#### Documentation

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
