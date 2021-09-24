
const express = require('express');
const mongoose = require('mongoose');
const route = express.Router();
const VipAlarms = require('../schemas/tradebotalarms');
const User = require('../schemas/user');
const { sendPushNotification } = require('../controllers/general')
route.get('/', async (req, res) => {
    const getAlarms = await VipAlarms.find({}).sort({ createdAt: -1 })
    res.send({ alarms: getAlarms })

});


route.post('/', async (req, res) => {
    const message = JSON.parse(req.body.text.replace(/'/g, '"').replace('message', '"message"').replace('coin', '"coin"').replace('value', '"value"'))
    //TODO : Push notification Sadece satın almış olanlara
    console.log("geldi")
    let nowDate = new Date()

    const findVipUsers = await User.find({ subscription: true, subscriptionEndDate: { $gt: nowDate } })
    for await (const user of findVipUsers) {
        // console.log(user)
        await sendPushNotification(user._id, {
            title: "Cuzdan App Vip Alarmı",
            body: `${message.coin.toUpperCase()} : ${message.value} - ${message.message} `,
            message: "",
        })
    }
    const addAlarm = await new VipAlarms({ ...message }).save();
    res.send("ok")
});

module.exports = route;

