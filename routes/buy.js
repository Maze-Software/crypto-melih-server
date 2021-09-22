

const express = require('express');
const mongoose = require('mongoose');
const route = express.Router();



route.post('/', async (req, res) => {
    if (req.body.userId) {
        const { month = 1 } = req.body
        await general.activeUserSubscription(month, req.body.userId);
        res.send(true)
    }
    else {
        res.send(false)
    }
});


module.exports = route;