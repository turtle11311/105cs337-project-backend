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

router.param('filepath', (req, res, next, filepath) => {
  req.fullpath = path.join(req.repoPath, filepath);
  next();
});

router.get('/repos', (req, res) => {
  fs.readdir(path.join(config.rootDir, 'Repositories'), (err, files) => {
    if (err) {
      res.status(406).send(err);
      console.error(err);
      return;
    }
    debug(files);
    res.send(files);
  });
});

router.get('/ls/:repo', (req, res) => {
  try {
    let result = folderTraveler(req.repoPath, './');
    res.send(result);
  } catch (err) {
    console.error(err);
    res.sendStatus(406);
  }
});

router.get('/:repo/:filepath([-a-zA-Z0-9_./]+)', (req, res) => {
  fs.readFile(req.fullpath, (err, content) => {
    if (err) {
      console.error(err);
      res.status(406).send(err);
      return;
    }
    res.send(content);
  });
});

router.post('/:repo/:filepath([-a-zA-Z0-9_./]+)', (req, res) => {
  fs.ensureFile(req.fullpath, (err) => {
    if (err) {
      res.status(406).send(err);
      return;
    }
    res.send(`Add ${req.params.filepath}`);
  });
});

router.delete('/:repo/:filepath([-a-zA-Z0-9_./]+)', (req, res) => {
  fs.remove(req.fullpath, (err) => {
    if (err) {
      res.status(406).send(err);
      return;
    }
    res.send(`Remove ${req.params.filepath}`);
  });
});

router.put('/:repo/:filepath([-a-zA-Z0-9_./]+)', (req, res) => {
  fs.outputFile(req.fullpath, req.body.content, (err) => {
    debug(req.body.content);
    if (err) {
      console.error(err);
      res.status(406).send(err);
      return;
    }
    res.send(`Save ${req.params.filepath}`);
  });
});

module.exports = router;
