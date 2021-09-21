
const errorHandler = require("./errorHandler");
const { isAdmin, checkLogin, checkMissingParams, isUserSubscribed } = require("./general");
const bcrypt = require("bcryptjs");
const config = require("../config.json");
var jwt = require("jsonwebtoken");
const Admins = require("../schemas/admins");
const Axios = require("axios");
const User = require("../schemas/user");
const TradingViews = require("../schemas/tradingview");
const Prices = require("../schemas/prices");

const getStatus = async (req, res) => {
  const getUser = await checkLogin(req)
  if (await !getUser) { return new errorHandler(res, 401, -1) }
  if (await !isUserSubscribed(getUser)) { return new errorHandler(res, 401, -1) }

  const findRecord = await TradingViews.find({ userId: getUser._id })
  if (!findRecord) {
    return res.send({ status: 0 })
  }
  else {
    return res.send({ status: findRecord[0].status })
  }
}
const apply = async (req, res) => {
  const getUser = await checkLogin(req)
  if (await !getUser) { return new errorHandler(res, 401, -1) }
  if (await !isUserSubscribed(getUser)) { return new errorHandler(res, 401, -1) }

  const { tradingViewName } = req.body;

  if (tradingViewName) {
    await new TradingViews({ userId: getUser._id, tradingViewName: tradingViewName, status: 1 }).save();
    return res.send("ok")
  }
  return new errorHandler(res, 500, 0)

}

const approve = async (req, res) => {
  if (await !isAdmin(req)) { return new errorHandler(res, 401, -1) }
  const { _id } = req.body;
  if (_id) {
    await TradingViews.findByIdAndUpdate(_id, { status: 2 });
    return res.send("ok")
  }
  return new errorHandler(res, 500, 0)
}


const remove = async (req, res) => {
  if (await !isAdmin(req)) { return new errorHandler(res, 401, -1) }
  const { _id } = req.body;
  if (_id) {
    await TradingViews.findByIdAndUpdate(_id, { status: 3 });
    return res.send("ok")
  }
  return new errorHandler(res, 500, 0)
}
const getApplications = async (req, res) => {
  if (await !isAdmin(req)) { return new errorHandler(res, 401, -1) }
  const applications = await TradingViews.find({ status: { $ne: 3 } }).lean();
  let index = 0;
  for await (const row of applications.map(e => e)) {
    applications[index].user = await User.findById(row.userId);
    index++
  }
  return res.send({ data: applications })
}

module.exports = {
  apply,
  getStatus,
  approve,
  remove,
  getApplications

}
