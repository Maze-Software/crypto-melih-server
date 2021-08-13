const TwitterFollows = require('../Schemas/twitterfollowings')
const TwitterUser = require('../Schemas/twitterusers')
const { checkMissingParams, checkLogin, isAdmin } = require('./general');
const errorHandler = require('./errorHandler');


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

const addTwitterUser = async (req, res) => {
    if (await !isAdmin(req)) { return new errorHandler(res, 401, -1) }
    const { username } = req.body;
    // get api from twitter
    const addTwitterUser = await TwitterUser({
        twitterId: "",
        username: "",
        image: "",
        info,
    }).save();
    res.status(200).send({ message: "added" })
}

const deleteTwitterUser = async (req, res) => {
    if (await !isAdmin(req)) { return new errorHandler(res, 401, -1) }
    const { id } = req.body;
    await TwitterUser.findByIdAndDelete(id)
    res.status(200).send({ message: "deleted" })
}

module.exports = {
    followUnfollowUser,
    getFollowingUsers,
    addTwitterUser,
    deleteTwitterUser
}