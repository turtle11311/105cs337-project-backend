'use strict';
const nodegit = require('nodegit');
const debug = require('debug')('apis:git');

module.exports = (req, res, next) => {
  const authorName = req.body.authorname || 'Noname';
  const authorEmail = req.body.authoremail || 'example@example.com';
  req.signature = nodegit.Signature.now(authorName, authorEmail);
  debug(`Signature{${req.signature.name()}, ${req.signature.email()}} is create!`);
  next();
};