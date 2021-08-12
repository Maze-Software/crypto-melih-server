
const express = require('express');
const mongoose = require('mongoose');
const route = express.Router();
const { adminLogin, addAdmin, getAllAdmins, deleteAdmin, updateAdmin, removeUser, getAllUser, getUserCount } = require('../controllers/admincontroller');

route.post('/login', async (req, res) => {
    await adminLogin(req, res);
});

route.post('/addadmin', async (req, res) => {
    await addAdmin(req, res);
});

route.get('/getadmins', async (req, res) => {
    await getAllAdmins(req, res);
});

route.post('/deleteadmin', async (req, res) => {
    await deleteAdmin(req, res);
});

route.post('/updateadmin', async (req, res) => {
    await updateAdmin(req, res);
});



// Admin Controls


route.post('/deleteuser', async (req, res) => {
    await removeUser(req, res);
});


route.get('/getusers', async (req, res) => {
    await getAllUser(req, res);
});
route.get('/usercount', async (req, res) => {
    await getUserCount(req, res);
});



module.exports = route;