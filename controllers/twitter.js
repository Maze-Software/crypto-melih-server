const TwitterFollows = require('../Schemas/twitterfollowings')
const TwitterUser = require('../Schemas/twitterusers')
const { checkMissingParams, checkLogin, isAdmin } = require('./general');
const errorHandler = require('./errorHandler');
const Axios = require('axios').default;
const config = require('../config.json')
const followUnfollowUser = async (req, res) => {
    const getUser = await checkLogin(req);
    const { username } = req.body;
    if (!getUser) { return new errorHandler(res, 401, -1) }
    if (!username) { return new errorHandler(res, 500, 1) }
    const userId = getUser._id;
    const checkExits = await TwitterFollows.exists({ username, userId });
    if (checkExits) {
        await TwitterFollows.deleteOne({ username, userId });
        res.status(200).send({ status: "unfollowed" })
    }
    else {
        const follow = await new TwitterFollows({ username, userId }).save();
        res.status(200).send({ status: "followed" })
    }
}
const getFollowingUsers = async (req, res) => {
    const getUser = await checkLogin(req);
    if (!getUser) { return new errorHandler(res, 401, -1) }
    const userId = getUser._id;
    const followings = await TwitterFollows.find({ userId }).lean();
    res.send({ followings: followings.map(e => e.username) })
}

const getTwitterProfile = async (username) => {
    const data = await Axios.get("https://api.twitter.com/1.1/users/show.json?screen_name=" + username, {
        headers: { 'Authorization': 'Bearer ' + config.twitterApi.token }
    })
    return data.data;
}

const getTweetOfUser = async (id) => {
    const data = await Axios.get("https://api.twitter.com/2/users/" + id + "/tweets?expansions=attachments.media_keys&tweet.fields=created_at,author_id,lang,source,public_metrics,context_annotations,entities", {
        headers: { 'Authorization': 'Bearer ' + config.twitterApi.token }
    })
    return data.data;
}

const getTwitterUser = async (req, res) => {
    if (await !isAdmin(req)) { return new errorHandler(res, 401, -1) }

    res.status(200).send({ data: await TwitterUser.find() })
}

const addTwitterUser = async (req, res) => {
    if (await !isAdmin(req)) { return new errorHandler(res, 401, -1) }
    const { username } = req.body;
    const addTwitterUser = await TwitterUser({
        username: username,
    }).save();
    res.status(200).send({ message: "added", data: addTwitterUser })
}

const deleteTwitterUser = async (req, res) => {
    if (await !isAdmin(req)) { return new errorHandler(res, 401, -1) }
    const { id } = req.body;
    await TwitterUser.findByIdAndDelete(id)
    res.status(200).send({ message: "deleted" })
}
const getTwitterFeed = async (req, res) => {
    const getUser = await checkLogin(req);
    if (!getUser) { return new errorHandler(res, 401, -1) }
    const userId = getUser._id
    const getFollowings = await TwitterFollows.find({ userId });
    const tweetList = [];
    const users = [];
    for await (const row of getFollowings) {
        const userInfo = await getTwitterProfile(row.username);
        users.push(userInfo)
    }
    for await (const user of users) {
        tweetList.push(await getTweetOfUser(user.id))
    }

    res.send({ tweetList: tweetList, user: users })
}

module.exports = {
    followUnfollowUser,
    getFollowingUsers,
    addTwitterUser,
    deleteTwitterUser,
    getTwitterFeed,
    getTwitterUser
}