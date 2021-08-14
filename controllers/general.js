const errorHandler = require('./errorHandler');
var jwt = require('jsonwebtoken');
const config = require('../config.json');

const Admins = require('../schemas/Admins');
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
            const user = await User.findOne({ userName: result.userName })

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
    let subscriptionEndDate = new Date(userObj.subscriptionEndDate).getTime();
    let nowDate = new Date().getTime();
    let constraint = userObj.subscription && nowDate < subscriptionEndDate;
    return constraint;
}

module.exports = { checkMissingParams, checkLogin, isAdmin, isUserSubscribed };
const User = require('../schemas/user');