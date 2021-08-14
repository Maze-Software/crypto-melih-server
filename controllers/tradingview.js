
const errorHandler = require("./errorHandler");
const { isAdmin, checkLogin, checkMissingParams, isUserSubscribed } = require("./general");
const bcrypt = require("bcryptjs");
const config = require("../config.json");
var jwt = require("jsonwebtoken");
const Admins = require("../schemas/Admins");
const Axios = require("axios");
const User = require("../schemas/user");
const TradingViews = require("../schemas/tradingview");
const Prices = require("../schemas/prices");

const getTradingView = async (req, res) => {
  const getUser = await checkLogin(req)
  if (!getUser) { return new errorHandler(res, 401, -1) };
  if (!isUserSubscribed(getUser)) { return new errorHandler(res, 401, 0) }
  const { width = 300, height = 300 } = req.body;
  const getTradingViews = TradingViews.find().sort({ created_at: -1 }).lean();
  getTradingViews.forEach((tradingView, index) => {
    getTradingViews[index].source =
      `
    <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
    <script type="text/javascript">
    var tradingview_embed_options = {};
    tradingview_embed_options.width = '${width}';
    tradingview_embed_options.height = '${height}';
    tradingview_embed_options.chart = '${tradingView.tradingViewId}';
    new TradingView.chart(tradingview_embed_options);
    </script>
    `;
  })
  res.send({ data: getTradingViews })
}
const addTradingView = async (req, res) => {
  if (await !isAdmin(req)) { return new errorHandler(res, 401, -1) }
  const { title, tradingViewId, description } = req.body;
  if (!title || !tradingViewId || !description) { return new errorHandler(res, 500, 1) }
  const newTradingView = await new TradingViews({ title, tradingViewId, description }).save();
  res.send("eklendi")
};
const deleteTradingView = async (req, res) => {
  if (await !isAdmin(req)) { return new errorHandler(res, 401, -1) }
  const { id } = req.body;
  const deleteTradingView = await TradingViews.findByIdAndDelete(id);
  res.send("ok")
};

const updateTradingView = async (req, res) => {
  if (await !isAdmin(req)) { return new errorHandler(res, 401, -1) }
  const { id, title, tradingViewId, description } = req.body;
  if (!id) { return new errorHandler(res, 500, 1) }
  const updateObj = {};
  if (title) updateObj.title = title;
  if (tradingViewId) updateObj.tradingViewId = tradingViewId;
  if (description) updateObj.description = description;

  const findAndUpdate = await TradingViews.findByIdAndUpdate(id, updateObj);
  res.send("trading view is updated")
};

module.exports = {
  getTradingView,
  addTradingView,
  deleteTradingView,
  updateTradingView
}
