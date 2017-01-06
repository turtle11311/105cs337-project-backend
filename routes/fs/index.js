'use strict';
const express = require('express');
const path = require('path');

const folderTraveler = require('./folderTraveler');
const config = require('../../config');

let router = express.Router();

router.param('repo', (req, res, next, repo) => {
  req.repoPath = path.join(config.rootDir, 'Repositories', repo);
  next();
});

router.post('/:repo/list', (req, res) => {
  try {
    let result = folderTraveler(req.repoPath);
    res.send(result);
  } catch (err) {
    console.log(err);
    res.sendStatus(406);
  }
});

module.exports = router;
