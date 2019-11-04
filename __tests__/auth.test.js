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

// === Your Test Code =================================================

describe('test', () => {
  it('lets a new user signup', async () => {
    let person = { username: 'todd', password: 'toddpassword', role: 'admin' };
    let user = await mockServer.post('/signup').send(person);
    expect(user.status).toBe(200);
    expect(user).toBeDefined();
  });
  it('let a current user signin', async () => {
    let user = await mockServer.post('/signin').send(userData.user);
    console.log(user.status);
    expect(user.status).toBe(200);
    expect(user).toBeDefined();
  });
});
