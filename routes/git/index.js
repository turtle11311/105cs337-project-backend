'use strict';
const express = require('express');
const nodegit = require('nodegit');
const path = require('path');
const bodyParser = require('body-parser');

let router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

module.exports = router;
