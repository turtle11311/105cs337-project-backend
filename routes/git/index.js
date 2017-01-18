'use strict';
const express = require('express');
const nodegit = require('nodegit');
const path = require('path');
const _ = require('lodash');

const config = require('../../config');

let router = express.Router();

router.post('/:initrepo([-a-zA-Z0-9_]+)/init', (req, res) => {
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
    res.send(`clone ${req.params.reponame} success`);
  });
});

router.param('repo', (req, res, next, repo) => {
  let repoPath = path.join(config.rootDir, 'Repositories', repo);
  req.repoPromise = nodegit.Repository.open(repoPath)
  .catch((error) => {
    console.log(error);
    res.status(406).send(`${error}`);
  }).then((repo) => {
    req.repo = repo;
    next();
  });
});

router.post('/:repo([-a-zA-Z0-9_]+)/add', (req, res) => {
  let files = req.body.files;
  console.log('here');
  if (!files || !_.isArray(files)) {
    res.status(406).send('files must be Array type');
    return;
  }

  req.repoPromise.then(() => {
    return req.repo.refreshIndex();
  }).then((indexResult) => {
    req.repoIndex = indexResult;
  }).then(() => {
    return _(files).forEach(fname => req.repoIndex.addByPath(fname));
  }).then((value) => {
    console.log(value);
    return req.repoIndex.write();
  }).done(() => {
    return req.repoIndex.writeTree();
  });

  res.send(`Add ${files} into Repo ${req.params.repo}`);
});

router.post('/:repo([-a-zA-Z0-9_]+)/commit', (req, res) => {
  // do some thing
});

module.exports = router;
