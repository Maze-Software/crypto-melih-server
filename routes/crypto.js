
const express = require('express');
const mongoose = require('mongoose');
const route = express.Router();

const { likeunlikecryptos } = require('../controllers/crypto');

route.post('/likeunlike', async (req, res) => {
    await likeunlikecryptos(req, res);
});


module.exports = route;