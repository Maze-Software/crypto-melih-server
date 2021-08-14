

const express = require('express');
const mongoose = require('mongoose');
const route = express.Router();

const { test } = require('../controllers/test');

route.get('/', async (req, res) => {
    test(req, res)
});


module.exports = route;