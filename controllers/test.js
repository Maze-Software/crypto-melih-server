const errorHandler = require('./errorhandler');
var jwt = require('jsonwebtoken');
const config = require('../config.json');
const general = require('./general');
const test = async (req, res) => {
    const status = await general.activeUserSubscription(1, "611bb7b78d5026274147c418")
    res.send(status)
}
module.exports = { test };
const User = require('../schemas/user');