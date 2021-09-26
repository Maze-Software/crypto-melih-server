

const express = require('express');
const mongoose = require('mongoose');
const route = express.Router();
const { checkLogin, activeUserSubscription } = require('../controllers/general')


route.post('/', async (req, res) => {
    if (req.body.userId) {
        const { month = 1 } = req.body
        await activeUserSubscription(month, req.body.userId);
        res.send(true)
    }
    else {
        res.send(false)
    }
});
route.post('/purchase', async (req, res) => {
    const user = await checkLogin(req)
    if (user && req.body.key == "uygulamaicisatinalma") {
        const month = 1
        await activeUserSubscription(month, req.body.userId);
        res.send(true)
    }
    else {
        res.status(500).send("fail")
    }


});


module.exports = route;