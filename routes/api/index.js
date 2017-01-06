'use strict';

const express = require('express');

const git = require('../git');
const fs_router = require('../fs');

let router = express.Router();

router.use('/git', git);
router.use('/fs', fs_router);

module.exports = router;
