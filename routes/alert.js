
const express = require('express');
const mongoose = require('mongoose');
const route = express.Router();
const VipAlarms = require('../schemas/tradebotalarms');

route.get('/', async (req, res) => {
    const getAlarms = await VipAlarms.find({}).sort({ createdAt: -1 })
    res.send({ alarms: getAlarms })

});


route.post('/', async (req, res) => {
    const message = JSON.parse(req.body.text.replace(/'/g, '"').replace('message', '"message"').replace('coin', '"coin"').replace('value', '"value"'))
    //TODO : Push notification Sadece satın almış olanlara
    console.log(message);
    const addAlarm = await new VipAlarms({ ...message }).save();
    res.send("ok")
});

module.exports = route;

