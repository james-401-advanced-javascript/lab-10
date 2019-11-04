'use strict';

const { server } = require('../lib/server');
const supertester = require('./supertester');
const mockServer = supertester.server(server);
const Users = require('../lib/models/users-model.js');

// === Mock Database Setup ============================================

// This portion of your test code is here to set up your
// mock database with some initial entries. Remember, when you
// test servers and databases, you don't want to actually change
// anything in your database. So, supertester creates a mock
// database that only exists during the run of npm test on this
// file. The below code adds some entries to the mock database
// before all the tests run, and then closes the database
// after all the tests complete.

let userData = {
  admin: { username: 'sarah', password: 'sarahpassword', role: 'admin' },
  editor: { username: 'bill', password: 'billpassword', role: 'editor' },
  user: { username: 'rene', password: 'renepassword', role: 'user' },
};

let users = new Users();

beforeAll(async done => {
  await supertester.startDB();
  const adminUser = await users.create(userData.admin);
  const editorUser = await users.create(userData.editor);
  const userUser = await users.create(userData.user);
  console.log(adminUser);
  console.log(editorUser);
  console.log(userUser);
  done();
});

afterAll(supertester.stopDB);

// === End Mock Database Setup ========================================

describe('test', () => {
  it('requires user to be signed in to get books from library', async () => {
    let bookData = await mockServer.get('/books');
    expect(bookData.status).toBe(403);
  });
  it('can get books for authorized user', async () => {
    let person = await mockServer.post('/signin').send({
      username: 'bill',
      password: 'billpassword',
    });
    let token = person.headers.token;
    let userBook = await mockServer
      .get('/books')
      .send({ token, username: 'bill', password: 'billpassword' });
    expect(userBook.status).toBe(200);
    expect(userBook.body.count).toBe(2);
  });
  it('can get individual book for authorized user', async () => {
    let person = await mockServer.post('/signin').send({
      username: 'rene',
      password: 'renepassword',
    });
    let token = person.headers.token;
    let userBook = await mockServer
      .get('/books/2')
      .send({ token, username: 'rene', password: 'renepassword' });
    expect(userBook.status).toBe(200);
    expect(userBook.body).toBeDefined();
  });
  it('restricts authenticated users from accessing unauthorized books', async () => {
    let person = await mockServer.post('/signin').send({
      username: 'rene',
      password: 'renepassword',
    });
    let token = person.headers.token;
    let userBook = await mockServer
      .get('/books/0')
      .send({ token, username: 'rene', password: 'renepassword' });
    expect(userBook.status).toBe(403);
    expect(userBook.text).toBe('Access Denied');
  });
});
