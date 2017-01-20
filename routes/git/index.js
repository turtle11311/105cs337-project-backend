'use strict';
const express = require('express');
const nodegit = require('nodegit');
const path = require('path');
const _ = require('lodash');
const debug = require('debug')('apis:git');

const config = require('../../config');

let router = express.Router();

router.post('/:initrepo([-a-zA-Z0-9_]+)/init', (req, res) => {
  let isBare = req.body.isbare;
  let repoName = req.params.initrepo;
  let repoPath = path.join(config.rootDir, 'Repositories', repoName);

  nodegit.Repository
    .init(repoPath, isBare === undefined ? 0 : parseInt(isBare))
    .catch((err) => {
      console.error(err);
      res.status(406).send(`${err}`);
    })
    .done(() => {
      res.send(`init ${repoName} success`);
    });
});

router.post('/clone/:reponame([-a-zA-Z0-9_]+)', (req, res) => {
  nodegit.Clone(req.body.url,
    path.join(config.rootDir, 'Repositories', req.params.reponame))
    .catch((err) => {
      console.log(err);
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

router.post('/:repo([-a-zA-Z0-9_]+)/add', (req, res) => {
  let files = req.body.files;
  let hasError = false;
  if (!files || !Array.isArray(files)) {
    res.status(406).send('files must be Array type');
    return;
  }
  let PromiseChain = req.repoPromise;
  _(files).forEach(fname => {
    PromiseChain = PromiseChain.then(() => req.repoIndex.addByPath(fname));
  });

  PromiseChain
    .catch((err) => {
      hasError = true;
      console.log(err);
    })
    .then(() => {
      return req.repoIndex.write();
    })
    .then(() => {
      return req.repoIndex.writeTree();
    })
    .done(() => {
      if (hasError)
        res.status(406).send('Add fail');
      else
        res.send(`Add ${files} into Repo ${req.params.repo}`);
    });
});

router.post('/:repo([-a-zA-Z0-9_]+)/commit', (req, res) => {
  let massage = req.body.massage;
  req.repoPromise
    .then(() => {
      return req.repoIndex.writeTree();
    })
    .then((oidResult) => {
      req.repoOid = oidResult;
      return nodegit.Reference.nameToId(req.repo, "HEAD");
    })
    .then((head) => {
      return req.repo.getCommit(head);
    })
    .then((parent) => {
      let author = nodegit.Signature.create("Scott Chacon",
        "schacon@gmail.com", Date.now(), 60);
      let committer = nodegit.Signature.create("Scott A Chacon",
        "scott@github.com", Date.now(), 90);

      return req.repo.createCommit("HEAD", author, committer, massage, req.repoOid, [parent]);
    })
    .done((commitId) => {
      res.send(`New Commit: ${commitId}, Massage: ${massage}`);
    });
});

module.exports = router;
