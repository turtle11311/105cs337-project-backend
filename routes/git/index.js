'use strict';
const express = require('express');
const nodegit = require('nodegit');
const ch = require('child_process');
const path = require('path');
const _ = require('lodash');
const debug = require('debug')('apis:git');

// middleware for nodegit
const config = require('../../config');
const add = require('./add');
const newSignature = require('./newSignature');
const commit = require('./commit');


let router = express.Router();

router.post('/init/:initrepo([-a-zA-Z0-9_.]+)', (req, res) => {
  const repoName = req.params.initrepo;
  const repoPath = path.join(config.rootDir, 'Repositories', repoName);

  nodegit.Repository.init(repoPath, 0)
    .done(() => {
      res.send(`Init ${repoName}`);
    });
});

router.post('/cloneto/:reponame([-a-zA-Z0-9_.]+)', (req, res) => {
  nodegit.Clone(req.body.url,
      path.join(config.rootDir, 'Repositories', req.params.reponame))
    .catch((err) => {
      console.error(err);
      res.status(406).send(`${err}`);
    })
    .then((repo) => {
      res.send(`clone ${req.params.reponame} success`);
    });
});

router.param('repo', (req, res, next, repo) => {
  debug('Start open a repo');
  let repoPath = path.join(config.rootDir, 'Repositories', repo);
  req.repoPromise = nodegit.Repository.open(repoPath)
    .catch((err) => {
      console.error(err);
      res.status(406).send(`${err}`);
    })
    .then((repo) => {
      req.repo = repo;
    })
    .then(() => {
      return req.repo.refreshIndex();
    })
    .then((indexResult) => {
      req.repoIndex = indexResult;
      next();
    });
});

router.post('/commit/:repo([-a-zA-Z0-9_.]+)', [newSignature, add, commit]);

router.get('/diff/:repo([-a-zA-Z0-9_.]+)/:filepath([-a-zA-Z0-9_./]+)', (req, res) => {
  var cmd = `git diff master~ --word-diff -- ${req.params.filepath} | ${path.join(config.rootDir, './bin/DiffLog.exe')} | ${path.join(config.rootDir ,'./bin/ToJson.exe')}`;
  debug(`Cmd: ${cmd}`);
  var diff = ch.execSync(cmd);
  diff = diff.toString();
  debug(diff);
  res.send(diff);
});

module.exports = router;

router.get('/status/:repo', (req, res) => {
  function status(status) {
    let words = [];
    if (status.isNew())         words.push('NEW');
    if (status.isModified())    words.push('MODIFIED');
    if (status.isTypechange())  words.push('TYPECHANGE');
    if (status.isRenamed())     words.push('RENAMED');
    if (status.isIgnored())     words.push('IGNORED');
    return words;
  }
  debug(req.repo.workdir());
  req.repo.getStatus()
  .then((statuses) => {
    return statuses.map(file => new Object({name: file.path(), status: status(file)}));
  })
  .done((statuses) => {
    res.send(statuses);
  });
});