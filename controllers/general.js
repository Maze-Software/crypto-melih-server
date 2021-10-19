const errorHandler = require('./errorhandler');
var jwt = require('jsonwebtoken');
const config = require('../config.json');
const PushTokens = require('../schemas/pushtokens')
const Admins = require('../schemas/admins');
const checkMissingParams = (array, req, res) => {
    try {
        array.forEach(key => {
            if (!req.body.hasOwnProperty(key)) {
                new errorHandler(res, 500, 1, { value: key })
                return false;
            }
        });

        return true;
    }
    catch (e) {
        // console.log(e)
    }
}
const checkLogin = async (req) => {

    try {
        const token = req.cookies.token;

        if (token) {
            var result = jwt.verify(token, config.privateKey);
            const user = await User.findById(result.userId)

            if (user) {
                return user;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    catch (e) {
        return false;
    }

}
const isAdmin = async (req) => {

    try {
        const token = req.cookies.token;

        if (token) {
            var result = jwt.verify(token, config.privateKey);
            const user = await Admins.findOne({ email: result.email })

            if (user && result.type == 'admin') {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    catch (e) {
        return false;
    }

}

const isUserSubscribed = async (userObj) => {
    try {

        let subscriptionEndDate = new Date(userObj.subscriptionEndDate).getTime();
        let nowDate = new Date().getTime();
        let constraint = userObj.subscription && nowDate < subscriptionEndDate;
        return constraint;
    }
    catch (e) {
        return false
    }
}

const activeUserSubscription = async (month = 1, userId) => {
    const user = await User.findById(userId)
    if (user) {
        const newDate = new Date(user.subscriptionEndDate);
        const subscriptionEndDate = newDate.setMonth(newDate.getMonth() + month)
        await User.findByIdAndUpdate(user._id, { subscription: true, subscriptionEndDate: subscriptionEndDate })
        return true
    }
    else {
        return false;
    }
}
const sendPushNotification = async (userId, messageObject = { title: "", message: "" }) => {
    const findToken = await PushTokens.findOne({ userId: userId });

    if (findToken) {
        if (findToken.pushToken) {
            const { data } = await axios.post("https://exp.host/--/api/v2/push/send", {
                ...messageObject,
                to: findToken.pushToken,
                sound: true,
                vibrate: true
            });
        }
    }
}

module.exports = { checkMissingParams, checkLogin, isAdmin, isUserSubscribed, activeUserSubscription, sendPushNotification };
const User = require('../schemas/user');
const { default: axios } = require('axios');
