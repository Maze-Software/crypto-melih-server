
const TwitterFollows = require('../schemas/twitterfollowings')
const TwitterUser = require('../schemas/twitterusers')
const User = require('../schemas/user')
const { checkMissingParams, checkLogin, isAdmin } = require('./general');
const errorHandler = require('./errorhandler');
const Axios = require('axios').default;
const config = require('../config.json')
const followUnfollowUser = async (req, res) => {
    const getUser = await checkLogin(req);
    const { username } = req.body;
    if (!getUser) { return new errorHandler(res, 401, -1) }
    if (!username) { return new errorHandler(res, 500, 1) }
    const userId = getUser._id;
    const checkExits = await TwitterFollows.exists({ username, userId });
    if (req.body.safe && checkExits) { return res.send({ already: true }) }
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
    const getFeedUsers = await TwitterUser.find({ username: { $in: followings.map(e => e.username) } })

    res.send({ followings: getFeedUsers })
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

    res.status(200).send({ data: await TwitterUser.find({ fixed: true }) })
}

const addTwitterUser = async (req, res) => {
    if (await !isAdmin(req)) { return new errorHandler(res, 401, -1) }
    const { username } = req.body;
    let addTwitterUser = {}
    if (!await TwitterUser.exists({ username })) {
        const getUserTwitter = await getTwitterProfile(username);
        addTwitterUser = await new TwitterUser({
            twitterId: getUserTwitter.id,
            username: username,
            info: getUserTwitter,
            fixed: true
        }).save();
    }
    else {
        addTwitterUser = await new TwitterUser({ username: username }).save()
    }



    const getUsers = User.find({});

    for await (const user of getUsers.map(e => e)) {
        await new TwitterFollows({ username: username, userId: user._id }).save();
    }


    res.status(200).send({ message: "added", data: addTwitterUser })
}

const deleteTwitterUser = async (req, res) => {
    if (await !isAdmin(req)) { return new errorHandler(res, 401, -1) }
    const { id } = req.body;
    const getTwitterUser = await TwitterUser.findById(id)
    await TwitterUser.findByIdAndDelete(id)
    const getUsers = User.find({});

    for await (const user of getUsers.map(e => e)) {
        await TwitterFollows.deleteMany({ username: getTwitterUser.username, userId: user._id })
    }

    res.status(200).send({ message: "deleted" })
}

const getTwitterFeedWithoutAuth = async (req, res) => {



    const getFeedUsers = await TwitterUser.find({ fixed: true })



    let tweetList = [];
    const users = [];

    for await (const user of getFeedUsers) {

        const twitterdata = await getTweetOfUser(user.twitterId)
        if (twitterdata.data)
            tweetList.push(twitterdata.data.map(e => new Object({ user: user, tweet: e })))
    }


    tweetList = tweetList.reduce((acc, val) => acc.concat(val), [])

    tweetList = tweetList.sort((firsttweet, secondtweet) => {
        return firsttweet.tweet.created_at > secondtweet.tweet.created_at ? -1 : 1

    })
    // .sort(() => Math.random() - 0.5)
    res.send({ tweetList: tweetList })





}

const getTwitterFeed = async (req, res) => {

    const getUser = await checkLogin(req);
    if (!getUser) { return getTwitterFeedWithoutAuth(req, res) }
    const userId = getUser._id

    const getFollowings = await TwitterFollows.find({ userId }).lean();

    const getFeedUsers = await TwitterUser.find({ username: { $in: getFollowings.map(e => e.username) } })



    let tweetList = [];
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
    tweetList = tweetList.reduce((acc, val) => acc.concat(val), [])

    tweetList = tweetList.sort((firsttweet, secondtweet) => {
        return firsttweet.tweet.created_at > secondtweet.tweet.created_at ? -1 : 1

    })
    // .sort(() => Math.random() - 0.5)
    res.send({ tweetList: tweetList })





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
