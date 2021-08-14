const User = require('../schemas/user');
var validator = require('validator');
const errorHandler = require('./errorHandler');
const { checkMissingParams, checkLogin } = require('./general');
const bcrypt = require('bcryptjs');
const config = require('../config.json');
var jwt = require('jsonwebtoken');
const CeyptoLikes = require('../schemas/likedcryptos')
const likeunlikecryptos = async (req, res) => {
    const getUser = await checkLogin(req);
    const { symbol } = req.body;
    if (!getUser) { return new errorHandler(res, 401, -1) }
    if (!symbol) { return new errorHandler(res, 500, 1) }
    const userId = getUser._id;
    const checkExits = await CeyptoLikes.exists({ symbol, userId });
    if (checkExits) {
        await CeyptoLikes.deleteOne({ symbol, userId });
        res.status(200).send({ status: "unliked" })
    }
    else {
        const follow = await new CeyptoLikes({ symbol, userId }).save();
        res.status(200).send({ status: "liked" })
    }
}

module.exports = {
    likeunlikecryptos,
}