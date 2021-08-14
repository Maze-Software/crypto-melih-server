const errorHandler = require('./errorHandler');
var jwt = require('jsonwebtoken');
const config = require('../config.json');
const general = require('./general');
const test = async (req, res) => {
    await general.activeUserSubscription(1, "611595039ed335ff3a7808d6")
    res.send("ok")
}
module.exports = { test };
const User = require('../schemas/user');