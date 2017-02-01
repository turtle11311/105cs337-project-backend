'use strict';
const nodegit = require('nodegit');
const debug = require('debug')('apis:git');

module.exports = (req, res, next) => {
  req.repoPromise = req.repoPromise
  .then(() => {
    return req.repoIndex.writeTree();
  })
  .then((oidResult) => {
    req.oid = oidResult;
    return nodegit.Reference.nameToId(req.repo, 'HEAD');
  })
  .then((head) => {
    return req.repo.getCommit(head);
  })
  .catch((err) => {
    console.error(err);
  })
  .then((parent) => {
    debug('parent' + parent);
    return req.repo.createCommit('HEAD', req.signature, req.signature,
                                 req.body.massage, req.oid, parent ? [parent] : []);
  })
  .done((commitID) => {
    debug(`New Commit: ${commitID} with massage ${req.body.massage}`);
    res.send(`New Commit: ${commitID} with massage ${req.body.massage}`);
  });
};