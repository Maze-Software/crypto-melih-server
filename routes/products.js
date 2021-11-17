
const express = require('express');
const mongoose = require('mongoose');
const route = express.Router();
const config = require("../config.json")
route.get('/', async (req, res) => {
    res.send({ products: config.products })
});


module.exports = route;

