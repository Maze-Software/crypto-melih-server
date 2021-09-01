
const express = require('express');
const mongoose = require('mongoose');
const route = express.Router();

const { apply,
    getStatus,
    approve,
    remove,
    getApplications } = require('../controllers/tradingview');

route.get('/', async (req, res) => {
    await getStatus(req, res);
});

route.post('/apply', async (req, res) => {
    await apply(req, res);
});

route.post('/approve', async (req, res) => {
    await approve(req, res);
});

route.post('/remove', async (req, res) => {
    await remove(req, res);
});

route.get('/getapplications', async (req, res) => {
    await getApplications(req, res);
});



module.exports = route;