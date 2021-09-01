
const express = require('express');
const mongoose = require('mongoose');
const route = express.Router();
const { getUserInvesting, setInvesting, deleteInvesting, getTotalInvesting } = require('../controllers/investing');

route.get('/', async (req, res) => {
    await getUserInvesting(req, res);
});

route.post('/add', async (req, res) => {
    await setInvesting(req, res);
});

route.post('/delete', async (req, res) => {
    await deleteInvesting(req, res);
});

route.get('/total', async (req, res) => {
    await getTotalInvesting(req, res);
});


module.exports = route;