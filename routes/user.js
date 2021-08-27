

const express = require('express');
const mongoose = require('mongoose');
const route = express.Router();

const { _isUserSubscribed, changeUserProfile, changePassword, changeUserProfile } = require('../controllers/usercontroller');

route.get('/isusersubscribed', async (req, res) => {
    _isUserSubscribed();
});

route.post('/changepassword', async (req, res) => {
    changePassword();
});


route.post('/forgetpassword', async (req, res) => {
    forgetPassword();
});


route.post('/changeprofile', async (req, res) => {
    changeUserProfile();
});

module.exports = route;