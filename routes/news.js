
const express = require('express');
const mongoose = require('mongoose');
const route = express.Router();
const { getNews } = require('../controllers/news');

route.get('/', async (req, res) => {
    await getNews(req, res);
});

module.exports = route;