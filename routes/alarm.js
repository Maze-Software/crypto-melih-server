
const express = require('express');
const mongoose = require('mongoose');
const route = express.Router();
const { setAlarm, getUserAlarm, tracker } = require('../controllers/alarm');

route.get('/', async (req, res) => {
    await getUserAlarm(req, res);
});

route.post('/set', async (req, res) => {
    await setAlarm(req, res);
});

route.get('/track', async (req, res) => {
    await tracker(req, res);
});



module.exports = route;