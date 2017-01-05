'use strict';

const express = require('express');

const git = require('../git');

let router = express.Router();

router.use('/git', git);

module.exports = router;
