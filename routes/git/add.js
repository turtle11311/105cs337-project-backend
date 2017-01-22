'use strict';
const nodegit = require('nodegit');
const path = require('path');
const _ = require('lodash');
const debug = require('debug')('apis:git');

module.exports = (req, res, next) => {
  const files = req.body.files;
  let hasError = false;

  _(files).forEach(fname => {
    req.repoPromise = req.repoPromise.then(() => req.repoIndex.addByPath(fname));
  })
  req.repoPromise = req.repoPromise
  .catch((err) => {
    hasError = true;
    console.error(err);
  })
  .then(() => {
    if (!hasError) next();
    else res.status(406).send('Add file error!');
  })
  .then(() => {
    req.repoIndex.write();
  });
};