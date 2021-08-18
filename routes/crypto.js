
const express = require('express');
const mongoose = require('mongoose');
const route = express.Router();

const { likeunlikecryptos, getLikedCryptos } = require('../controllers/crypto');

route.post('/likeunlike', async (req, res) => {
    await likeunlikecryptos(req, res);
});

route.get('/liked', async (req, res) => {
    await getLikedCryptos(req, res);
});


module.exports = route;