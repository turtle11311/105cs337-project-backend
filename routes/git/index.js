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
    }).then(() => {
      return req.repo.refreshIndex();
    }).then((indexResult) => {
      req.repoIndex = indexResult;
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
    return _(files).forEach(fname => req.repoIndex.addByPath(fname));
  }).then((value) => {
    console.log(value);
    return req.repoIndex.write();
  }).then(() => {
    return req.repoIndex.writeTree();
  }).done(() => {
    res.send(`Add ${files} into Repo ${req.params.repo}`);
  });
});

router.post('/:repo([-a-zA-Z0-9_]+)/commit', (req, res) => {
  let massage = req.body.massage;
  req.repoPromise.then(() => {
    return req.repoIndex.writeTree();
  }).then((oidResult) => {
    req.repoOid = oidResult;
    return nodegit.Reference.nameToId(req.repo, "HEAD");
  }).then((head) => {
    return req.repo.getCommit(head);
  }).then((parent) => {
    let author = nodegit.Signature.create("Scott Chacon",
      "schacon@gmail.com", 123456789, 60);
    let committer = nodegit.Signature.create("Scott A Chacon",
      "scott@github.com", 987654321, 90);

    return req.repo.createCommit("HEAD", author, committer, massage, req.repoOid, [parent]);
  }).done((commitId) => {
    res.send(`New Commit: ${commitId}, Massage: ${massage}`);
  });
});

module.exports = router;
