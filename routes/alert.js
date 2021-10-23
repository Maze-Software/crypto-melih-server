
const express = require('express');
const mongoose = require('mongoose');
const route = express.Router();
const VipAlarms = require('../schemas/tradebotalarms');
const DeletedVipAlerts = require('../schemas/deletedvipalerts');
const User = require('../schemas/user');
const { sendPushNotification, checkLogin } = require('../controllers/general')
route.get('/', async (req, res) => {
    const getUser = await checkLogin(req);
    if (!getUser) { return res.status(500).send("false") }
    const getDeletedAlarms = await DeletedVipAlerts.find({ userId: getUser._id }).lean()
    const deletedIds = getDeletedAlarms.map(e => e.alertId)
    const getAlarms = await VipAlarms.find({ _id: { $nin: deletedIds } }).sort({ createdAt: -1 })
    res.send({ alarms: getAlarms })

});


route.post('/', async (req, res) => {
    const message = JSON.parse(req.body.text.replace(/'/g, '"').replace('message', '"message"').replace('coin', '"coin"').replace('value', '"value"'))
    //TODO : Push notification Sadece satın almış olanlara
    let nowDate = new Date()

    const findVipUsers = await User.find({ subscription: true, subscriptionEndDate: { $gt: nowDate } })
    for await (const user of findVipUsers) {
        // console.log(user)
        await sendPushNotification(user._id, {
            data: { "parentPage": "ApplyTradeBotScreen", "childPage": "TradeBotAlarmsScreen" },
            title: "Cuzdaan App Vip Alarmı",
            body: `${message.coin.toUpperCase()} : ${message.value} - ${message.message} `,
            message: "",
            sound: true,
            vibrate: true
        })
    }
    const addAlarm = await new VipAlarms({ ...message }).save();
    res.send("ok")
});
route.post('/delete', async (req, res) => {
    try {
        const getUser = await checkLogin(req);
        if (!getUser) { return res.status(500).send("false") }
        const { alertId } = req.body;
        const findAlert = await VipAlarms.exists({ _id: alertId })
        if (findAlert) {
            if (!await DeletedVipAlerts.exists({
                userId: getUser._id,
                alertId: alertId
            })) {

                const newDeletedAlarms = await new DeletedVipAlerts({
                    userId: getUser._id,
                    alertId: alertId
                }).save();
            }
            res.send("ok")
        }
        else {
            res.status(500).send("false")
        }
    }
    catch (e) {
        res.status(500).send("false")
    }
});

route.post('/deleteall', async (req, res) => {

    // try {
    const getUser = await checkLogin(req);
    if (!getUser) { return res.status(500).send("false") }

    const findOwnDeletedAlert = await DeletedVipAlerts.find({ userId: getUser._id, })
    const findAlert = await VipAlarms.find({ _id: { $nin: findOwnDeletedAlert.map(e => e.alertId) } })

    for await (const alertObj of findAlert) {


        const newDeletedAlarms = await new DeletedVipAlerts({
            userId: getUser._id,
            alertId: alertObj._id
        }).save();




    }
    res.send("ok")
    // }
    // catch (e) {
    //     res.status(500).send("false")
    // }
});

module.exports = route;

