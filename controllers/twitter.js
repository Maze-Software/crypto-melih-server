const TwitterFollows = require('../Schemas/twitterfollowings')
const { checkMissingParams, checkLogin } = require('./general');
const errorHandler = require('./ErrorHandler');


const followUnfollowUser = async (req, res) => {
    const getUser = await checkLogin(req);
    const { twitterId } = req.body;
    if (!getUser) { return new errorHandler(res, 401, -1) }
    if (!twitterId) { return new errorHandler(res, 500, 1) }
    const userId = getUser._id;
    const checkExits = await TwitterFollows.exists({ twitterId, userId });
    if (checkExits) {
        await TwitterFollows.deleteOne({ twitterId, userId });
        res.status(200).send({ status: "unfollowed" })
    }
    else {
        const follow = await new TwitterFollows({ twitterId, userId }).save();
        res.status(200).send({ status: "followed" })
    }
}
const getFollowingUsers = async (req, res) => {
    const getUser = await checkLogin(req);
    if (!getUser) { return new errorHandler(res, 401, -1) }
    const userId = getUser._id;
    const followings = await TwitterFollows.find({ userId }).lean();
    res.send({ followings: followings.map(e => e.twitterId) })
}

module.exports = {
    followUnfollowUser,
    getFollowingUsers
}