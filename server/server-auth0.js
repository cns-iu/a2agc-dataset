#!/usr/bin/env node
/* jshint esversion: 6 */
const logger = require('morgan');
const express = require('express');
const path = require('path');
const { auth } = require('express-openid-connect');
const session = require('express-session');

// Grab path to env file from command line if available. 
// Otherwise, check for a .env file adjacent to this file.
const args = process.argv.slice(2);
const ENV_FILE = args.length > 0 && args[0] || path.join(__dirname, '.env');

// Load the .env file for configuration options
require('dotenv').config({ path: ENV_FILE });

// Setup configuration options
const PORT = Number(process.env.PORT) || 8080;
const LISTEN_ADDR = process.env.LISTEN_ADDR || '0.0.0.0';
const USERS = (process.env.USERS ? process.env.USERS.split(' ') : [])
  .map(u => u.indexOf('@') === -1 ? u + '@iu.edu' : u);
const PROTECTED_DIR = process.env.PROTECTED_DIR || './site';
const LOGGER = process.env.LOGGER || 'dev';
const SESSION_SECRET = process.env.SESSION_SECRET || 'cow-abunga d00d';
const BASE_URL = process.env.BASE_URL || '';

const auth0Config = {
  authRequired: true,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_URL
}

// Override remote-user login token
logger.token('remote-user', function (req, res) {
  return req.oidc && req.oidc.user && req.oidc.user.email || req.user;
});

// Given a path, find the absolute path to a file or directory
function abspath(rawPath) {
  if (rawPath.length && rawPath[0] === '.') {
    return path.resolve(path.join(__dirname, rawPath));
  } else {
    return path.resolve(rawPath);
  }
}

// Create the express instance
const app = express();

// Logging
app.use(logger(LOGGER));
// Session management
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
// Authentication
app.use(auth(auth0Config));

// Function to check authorization
function ensureAuth(req, res, next) {
  if (req.oidc.isAuthenticated()) {
    const user = req.oidc.user.email;
    const validUser = user && USERS.indexOf(user) !== -1;
    if (!validUser) {
      res.status(403).send(`You, ${user}, are not authorized to view this content.`);
    } else {
      return next();
    }
  } else {
    res.redirect(BASE_URL + '/login');
  }
}

// Host the protected site directory, allowing only authorized users to view
app.use('/', ensureAuth, express.static(abspath(PROTECTED_DIR)));

app.get('/profile', ensureAuth, (req, res) => {
  res.json({user: req.oidc.user});
});

// On 404, send the SPA index.html
app.get('*', ensureAuth, function (request, response) {
  response.sendFile(path.resolve(abspath(PROTECTED_DIR), 'index.html'));
});

// Start the server
app.listen(PORT, LISTEN_ADDR, 511, function() {
  console.log(`🚀 Server ready at http://${LISTEN_ADDR}:${PORT}`);
});
