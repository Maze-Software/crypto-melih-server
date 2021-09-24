const errorHandler = require('./errorhandler');
var jwt = require('jsonwebtoken');
const config = require('../config.json');
const general = require('./general');
const test = async (req, res) => {
    // const status = await general.activeUserSubscription(1, "611bb7b78d5026274147c418")
    // await general.sendPushNotification("611bb7b78d5026274147c418", { title: "Test", message: "test mesajı" })
    let nowDate = new Date()

    const findVipUsers = await User.find({ subscription: true, subscriptionEndDate: { $gt: nowDate } })
    res.send({ asd: findVipUsers })
}
module.exports = { test };
const User = require('../schemas/user');