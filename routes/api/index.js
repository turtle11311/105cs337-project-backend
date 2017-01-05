'use strict';

const express = require('express');
const nodegit = require('nodegit');
const path = require('path');

const git = require('../git');
const config = require('../../config');

let router = express.Router();

router.post('/git/:repo/init', (req, res) => {
  let isBare = req.body.isbare;
  let repoPath = path.join(config.rootDir, 'Repositories', req.params.repo);

  nodegit.Repository
  .init(repoPath, isBare === undefined ? 0 : parseInt(isBare))
  .catch((error) => {
    console.log(error);
    res.status(406).send(`${error}`);
  })
  .then(() => {
    res.send(`init ${req.params.repo} success`);
  });
});

router.use('/git/:repo', git);

module.exports = router;
