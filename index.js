const express = require("express");
// const Port = process.env.Port || 1337
const Port = 80;
const connectDB = require("./consts/dbconnection");
const app = express();
const config = require("./config.json");
var jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const server = require("http").Server(app);
const axios = require("axios");
app.use(cookieParser());
connectDB();
app.use(express.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));

const { alarmHandler } = require("./controllers/alarm")
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// ---------------------------------------- //
const path = require("path");
app.use(express.static(path.join(__dirname, "build")));
app.use((req, res, next) => {
  req.body = { ...req.body, ...req.query };
  if (req.body.token) {
    req.cookies.token = req.body.token;
  }
  next();
});

global.SOCKET_STATE = null; // diğer dosyalardan socket'e ulaşmak için
global.socketUsers = [];
global.exchangeRate = null;


app.use(express.static('./'))
app.use("/api/auth", require("./routes/auth"));
app.use("/api/news", require("./routes/news"));
app.use("/api/twitter", require("./routes/twitter"));
app.use("/api/alarm", require("./routes/alarm"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/tradingview", require("./routes/tradingview"));
app.use("/api/crypto", require("./routes/crypto"));
app.use("/api/test", require("./routes/test"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/investing", require("./routes/investing"));
app.use("/api/alert", require("./routes/alert"));
app.use("/api/user", require("./routes/user"));
app.use("/api/buy", require("./routes/buy"));
app.use("/api/appstore", require("./routes/appstore"));
app.use("/api/products", require("./routes/products"));


// -- ROUTES -- //
// USER
// app.use("/api/registeruser", require("./routes/RegisterUser"));
// app.use("/api/logout", require("./routes/LogOut"));
// app.use("/api/refreshToken", require("./routes/RefreshToken"));
// app.use("/api/login", require("./routes/Login"));
// app.use("/api/user/getvideo", require("./routes/GetVideos"));
// app.use("/api/user/getallvideos", require("./routes/GetAllVideos"));
// app.use("/api/user/getcategory", require("./routes/GetCategory"));
// app.use("/api/user/getallcategories", require("./routes/GetAllCategories"));
// app.use("/api/user/getallvideoparts", require("./routes/GetAllVideoParts"));
// app.use("/api/user/changeuserprofile", require("./routes/ChangeUserProfile"));
// app.use("/api/user/isusersubscribed", require("./routes/isUserSubscribed"));
// app.use("/api/user/changepassword", require("./routes/ChangePassword"));
// app.use("/api/user/sendmail", require("./routes/SendMail"));
// app.use("/api/user/forgetpassword", require("./routes/ForgetPassword"));
// app.use("/api/user/watchedinfo", require("./routes/WatchedInfo"));
// app.use("/api/user/getwatchedinfo", require("./routes/GetWatchedInfo"));
// app.use("/api/user/payment", require("./routes/Payment"));
// app.use("/api/user/paymentcallback", require("./routes/PaymentCallBack"));
// app.use("/api/user/getlistcombo", require("./routes/GetListCombo"));
// app.use("/api/user/getsuggestedvideos", require("./routes/GetSuggestedVideos"));
// app.use("/api/user/getsettings", require("./routes/Admin/GetSettings"));
// app.use("/api/screenshot", require("./routes/ScreenShot"));
// app.use("/api/termsandcondition", require("./routes/Termsandcondition"));

// // ADMIN ICIN
// app.use("/api/adminlogin", require("./routes/Admin/AdminLogin"));
// app.use("/api/addcategory", require("./routes/Admin/AddCategory"));
// app.use("/api/getcategory", require("./routes/Admin/GetCategory"));
// app.use("/api/getallcategories", require("./routes/Admin/GetAllCategories"));
// app.use("/api/updatecategory", require("./routes/Admin/UpdateCategory"));
// app.use("/api/deletecategory", require("./routes/Admin/DeleteCategory"));
// app.use("/api/addvideo", require("./routes/Admin/AddVideo"));
// app.use("/api/getvideo", require("./routes/Admin/GetVideo"));
// app.use("/api/getallvideos", require("./routes/Admin/GetAllVideos"));
// app.use("/api/getallvideoparts", require("./routes/Admin/GetAllVideoParts"));
// app.use("/api/updatevideo", require("./routes/Admin/UpdateVideo"));
// app.use("/api/deletevideo", require("./routes/Admin/DeleteVideo"));
// app.use("/api/addadmin", require("./routes/Admin/AddAdmin"));
// app.use("/api/updatevideopart", require("./routes/Admin/UpdateVideoPart"));
// app.use("/api/addvideopart", require("./routes/Admin/AddVideoPart"));
// app.use("/api/deletevideopart", require("./routes/Admin/DeleteVideoPart"));
// app.use("/api/getalladmins", require("./routes/Admin/GetAllAdmins"));
// app.use("/api/updateadmin", require("./routes/Admin/UpdateAdmin"));
// app.use("/api/deleteadmin", require("./routes/Admin/DeleteAdmin"));
// app.use("/api/getalluser", require("./routes/Admin/GetAllUser"));
// app.use("/api/getsettings", require("./routes/Admin/GetSettings"));
// app.use("/api/changesettings", require("./routes/Admin/ChangeSettings"));
// app.use("/api/getprices", require("./routes/GetPrices"));
// app.use("/api/changeprices", require("./routes/ChangePrices"));
// app.use("/api/addprice", require("./routes/AddPrice"));
// app.use("/api/deleteprice", require("./routes/DeletePrice"));
// app.use("/api/getusercount", require("./routes/Admin/getUserCount"));
// app.use("/api/removeuser", require("./routes/Admin/RemoveUser"));
// app.use("/api/selectvideos", require("./routes/Admin/SelectVideos"));
// -- ROUTES END -- //


// SOCKET EMBEDDING //

const socketInit = require("./socket/index.js");
app.get("/", function (req, res) {
  // res.sendFile(__dirname + "/Socket/html/index.html");
  res.send("cuzdanapp")
});


// socketInit(server);
// SOCKET EMBEDDING CLOSE //



// app.get("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

// ALARMLARIN KONTROL EDİLDİĞİ YER


var cron = require('node-cron');
cron.schedule('*/10 * * * * *', () => {
  alarmHandler();
});

// cron.schedule('*/10 * * * * *', () => {
//   alarmHandler();
// });

axios.get("https://api.exchangerate.host/latest?base=USD").then(data => global.exchangeRate = data.data)
cron.schedule('*/30 * * * *', () => {
  axios.get("https://api.exchangerate.host/latest?base=USD").then(data => global.exchangeRate = data.data)
});

server.listen(Port, () => console.log("Server started"));


// const notif = async () => {
//   const { data } = await axios.post("https://exp.host/--/api/v2/push/send", {
//     to: "ExponentPushToken[e63cvDMum7LOTDzeMrgpCb]",
//     sound: 'default', // <== the values are 'default' (sound) or null (silent)
//     data: { "parentPage": "TrackerScreen", "childPage": "AlarmsScreen" },
//     title: "Cuzdaan App Vip Alarmı",
//     body: `hahaha `,
//     message: "",
//   });
//   console.log(data)
// }
// notif()