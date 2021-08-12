
const express = require('express');
const mongoose = require('mongoose');
const route = express.Router();
const { followUnfollowUser, getFollowingUsers } = require('../controllers/twitter');

route.post('/followunfollowuser', async (req, res) => {
    await followUnfollowUser(req, res);
});
route.get('/followings', async (req, res) => {
    await getFollowingUsers(req, res);
});

module.exports = route;