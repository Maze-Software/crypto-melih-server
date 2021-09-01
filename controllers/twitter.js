
const TwitterFollows = require('../schemas/twitterfollowings')
const TwitterUser = require('../schemas/twitterusers')
const User = require('../schemas/user')
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
        if (!await TwitterUser.exists({ username })) {
            const getUserTwitter = await getTwitterProfile(username);
            await new TwitterUser({
                twitterId: getUserTwitter.id,
                username: username,
                info: getUserTwitter,
            }).save();
        }
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
    const data = await Axios.get("https://api.twitter.com/2/users/" + id + "/tweets?media.fields=duration_ms,height,media_key,preview_image_url,public_metrics,type,url,width,alt_text&tweet.fields=created_at,author_id,lang,source,public_metrics,context_annotations,entities", {
        headers: { 'Authorization': 'Bearer ' + config.twitterApi.token }
    })
    return data.data;
}

const test = async (req, res) => {
    const data = await Axios.get("https://api.twitter.com/2/users/3218790124/tweets?media.fields=duration_ms,height,media_key,preview_image_url,public_metrics,type,url,width,alt_text&tweet.fields=created_at,author_id,lang,source,public_metrics,context_annotations,entities", {
        headers: { 'Authorization': 'Bearer ' + config.twitterApi.token }
    })
    res.send({ data: data.data })
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

    const getUsers = User.find({});

    for await (const user of getUsers.map(e => e)) {
        await new TwitterFollows({ username: username, userId: user._id }).save();
    }


    res.status(200).send({ message: "added", data: addTwitterUser })
}

const deleteTwitterUser = async (req, res) => {
    if (await !isAdmin(req)) { return new errorHandler(res, 401, -1) }
    const { id } = req.body;
    await TwitterUser.findByIdAndDelete(id)
    const getUsers = User.find({});

    for await (const user of getUsers.map(e => e)) {
        await TwitterFollows.deleteMany({ username: username, userId: user._id })
    }

    res.status(200).send({ message: "deleted" })
}
const getTwitterFeed = async (req, res) => {

    const getUser = await checkLogin(req);
    if (!getUser) { return new errorHandler(res, 401, -1) }
    const userId = getUser._id
    const getFollowings = await TwitterFollows.find({ userId }).lean();

    const getFeedUsers = await TwitterUser.find({ username: { $in: getFollowings.map(e => e.username) } })




    const tweetList = [];
    const users = [];

    for await (const user of getFeedUsers) {
        const twitterdata = await getTweetOfUser(user.twitterId)
        if (twitterdata.data)
            tweetList.push(twitterdata.data.map(e => new Object({ user: user, tweet: e })))
    }

    /* Randomize array in-place using Durstenfeld shuffle algorithm */
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    res.send({ tweetList: tweetList.flat() })





    // const data = await Axios.get("https://api.twitter.com/2/users?ids=" + getFeedUsers.map(e => e.twitterId), {
    //     params: { "tweet.fields": 0 },
    //     headers: { 'Authorization': 'Bearer ' + config.twitterApi.token }
    // })


    // // console.log(data.data)
    // res.send({ as: data.data })



    // const getUser = await checkLogin(req);
    // if (!getUser) { return new errorHandler(res, 401, -1) }
    // const userId = getUser._id
    // const getFollowings = await TwitterFollows.find({ userId });
    // const tweetList = [];
    // const users = [];
    // for await (const row of getFollowings) {

    //     const userInfo = await getTwitterProfile(row.username);
    //     users.push(userInfo)
    // }
    // for await (const user of users) {
    //     tweetList.push(await getTweetOfUser(user.id))
    // }

    // res.send({ tweetList: tweetList, user: users })
}

const searchUser = async (req, res) => {
    const getUser = await checkLogin(req);
    if (!getUser) { return new errorHandler(res, 401, -1) }
    try {
        const data = await getTwitterProfile(req.body.username)
        res.send({ data: data })
    }
    catch (e) {
        res.status(404).send("fail")

    }



}

module.exports = {
    followUnfollowUser,
    getFollowingUsers,
    addTwitterUser,
    deleteTwitterUser,
    getTwitterFeed,
    getTwitterUser,
    searchUser,
    test
}
