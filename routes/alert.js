
const express = require('express');
const mongoose = require('mongoose');
const route = express.Router();
const { setAlarm, getUserAlarm, alarmHandler, deleteAlarm } = require('../controllers/alarm');

route.get('/', async (req, res) => {
    console.log("get", req.body, req)
    res.send("ok")
});


route.post('/', async (req, res) => {
    console.log("post", req.body)
    res.send("ok")
});

module.exports = route;