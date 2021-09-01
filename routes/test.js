

const express = require('express');
const mongoose = require('mongoose');
const route = express.Router();

const { test } = require('../controllers/twitter');

route.get('/', async (req, res) => {
    test(req, res)
});


module.exports = route;