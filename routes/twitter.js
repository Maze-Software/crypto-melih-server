
const express = require('express');
const mongoose = require('mongoose');
const route = express.Router();
const { followUnfollowUser, getFollowingUsers, getTwitterFeed } = require('../controllers/twitter');

route.post('/followunfollowuser', async (req, res) => {
    await followUnfollowUser(req, res);
});
route.get('/followings', async (req, res) => {
    await getFollowingUsers(req, res);
});
route.get('/feed', async (req, res) => {
    await getTwitterFeed(req, res);
});


module.exports = route;