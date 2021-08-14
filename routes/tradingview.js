
const express = require('express');
const mongoose = require('mongoose');
const route = express.Router();

const { getTradingView } = require('../controllers/tradingview');

route.get('/', async (req, res) => {
    await getTradingView(req, res);
});


module.exports = route;