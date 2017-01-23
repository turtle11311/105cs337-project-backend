'use strict';
const express = require('express');
const path = require('path');
const debug = require('debug')('apis:fs')
const fs = require('fs-extra');

const folderTraveler = require('./folderTraveler');
const config = require('../../config');

let router = express.Router();

router.param('repo', (req, res, next, repo) => {
  req.repoPath = path.join(config.rootDir, 'Repositories', repo);
  next();
});

router.get('/:repo/list', (req, res) => {
  try {
    let result = folderTraveler(req.repoPath, './');
    res.send(result);
  } catch (err) {
    console.error(err);
    res.sendStatus(406);
  }
});

router.get('/:repo/:filepath([-a-zA-Z0-9_./]+)', (req, res) => {
  fs.readFile(path.join(req.repoPath, req.params.filepath), (err, content) => {
    if (err) {
      res.sendStatus(406);
    }
    res.send(content);
  })
});

module.exports = router;
