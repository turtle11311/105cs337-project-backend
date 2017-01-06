'use strict';
const express = require('express');
const nodegit = require('nodegit');
const path = require('path');

const config = require('../../config');

let router = express.Router();

router.post('/:initrepo/init', (req, res) => {
  let isBare = req.body.isbare;
  let repoName = req.params.initrepo;
  let repoPath = path.join(config.rootDir, 'Repositories', repoName);

  nodegit.Repository
  .init(repoPath, isBare === undefined ? 0 : parseInt(isBare))
  .catch((error) => {
    console.log(error);
    res.status(406).send(`${error}`);
  })
  .then(() => {
    res.send(`init ${repoName} success`);
  });
});

router.post('/clone/:reponame([-a-zA-Z0-9_]+)', (req, res) => {
  nodegit.Clone(req.body.url,
                path.join(config.rootDir, 'Repositories', req.params.reponame))
  .catch((error) => {
    console.log(error);
    res.status(406).send(`${error}`);
  })
  .then((repo) => {
    console.log(`${repo}`);
    res.send(`clone ${req.params.reponame} success`);
  });
});

router.param('repo', (req, res, next, repo) => {
  console.log('repo');
  let repoPath = path.join(config.rootDir, 'Repositories', repo);
  nodegit.Repository.open(repoPath)
  .catch((error) => {
    console.log(error);
    res.status(406).send(`${error}`);
  })
  .then((repo) => {
    req.repo = repo;
    next();
  });
});

router.post('/:repo/add', (req, res) => {
  // do some thing
});

router.post('/:repo/commit', (req, res) => {
  // do some thing
});

module.exports = router;
