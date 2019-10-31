'use strict';

// Load in environment variables
require('dotenv').config();

// Start the server
require('./lib/server.js').start(3000);
