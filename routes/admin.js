
const express = require('express');
const mongoose = require('mongoose');
const route = express.Router();

const { addNews, deleteNews, updateNews } = require('../controllers/news');
const { addTwitterUser, deleteTwitterUser, getTwitterUser } = require('../controllers/twitter');
const { addTradingView, deleteTradingView, updateTradingView } = require('../controllers/tradingview');
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
route.post('/addnews', async (req, res) => {
    await addNews(req, res);
});
route.post('/deletenews', async (req, res) => {
    await deleteNews(req, res);
});
route.post('/updatenews', async (req, res) => {
    await updateNews(req, res);
});


// Twitter Users

route.post('/addtwitteruser', async (req, res) => {
    await addTwitterUser(req, res);
});
route.post('/deletetwitteruser', async (req, res) => {
    await deleteTwitterUser(req, res);
});
route.get('/gettwitterusers', async (req, res) => {
    await getTwitterUser(req, res);
});




route.post('/addtradingview', async (req, res) => {
    await addTradingView(req, res);
});

route.post('/deletetradingview', async (req, res) => {
    await deleteTradingView(req, res);
});
route.post('/updatetradingview', async (req, res) => {
    await updateTradingView(req, res);
});


module.exports = route;