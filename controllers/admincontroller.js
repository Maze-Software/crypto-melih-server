
const errorHandler = require("./errorHandler");
const { isAdmin, checkLogin, checkMissingParams } = require("./general");
const bcrypt = require("bcryptjs");
const config = require("../config.json");
var jwt = require("jsonwebtoken");
const Admins = require("../schemas/Admins");
const Axios = require("axios");
const User = require("../schemas/user");
const Settings = require("../schemas/settings");
const Prices = require("../schemas/prices");

const adminLogin = async (req, res) => {
  if ((await checkLogin(req)) == false) {
    const { email, password } = req.body;
    const userByEmail = await Admins.findOne({ email });
    if (userByEmail) {
      const comparePassword = await bcrypt.compare(password, userByEmail.hash);
      const token = jwt.sign(
        { email: email, type: "admin" },
        config.privateKey
      );
      if (comparePassword) {
        res.cookie("token", token); // set token to the cookie
        res.status(200).send({ token: token, user: userByEmail });
      } else {
        new errorHandler(res, 500, 13);
      }
    } else {
      new errorHandler(res, 500, 13);
    }
  } else {
    const user = await checkLogin(req);
    res.status(200).send({ token: req.cookies.token, user: user });
  }
};


const addAdmin = async (req, res) => {
  if (isAdmin(req)) {
    // Admin ise
    const params = ["email", "password", "firstName", "lastName"];
    // if (!checkMissingParams(params, req, res)) return;
    const { email, password, firstName, lastName } = req.body;
    const check = await Admins.exists({ email })
    if (check) { return res.status(500).send({ message: "Admin Already Exist" }); }
    const addAdmin = new Admins({
      email,
      hash: bcrypt.hashSync(password, 12),
      firstName,
      lastName,
    });
    await addAdmin.save();
    res.status(200).send({ message: "admin added" });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    if (isAdmin(req)) {
      // Admin ise
      // No need any parameters
      const admin = await Admins.find();

      // category.sort((a, b) => (a.categoryNumber > b.categoryNumber) ? 1 : ((b.categoryNumber > a.categoryNumber) ? -1 : 0));
      res.status(200).send({ data: admin });
    }
  } catch (e) {
    new errorHandler(res, 500, 0);
  }
};

const updateAdmin = async (req, res) => {
  if (isAdmin(req)) {
    // Admin ise

    // if (!checkMissingParams(params, req, res)) return;
    const { adminId, email, firstName, lastName } = req.body;
    console.log({ adminId, email, firstName, lastName });
    const addAdmin = Admins.findById(adminId);

    await addAdmin.updateOne({
      email,
      firstName,
      lastName,
    });
    res.status(200).send({ message: "admin updated" });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    if (isAdmin(req)) {
      // Admin ise

      const { adminId } = req.body;
      const admin = await Admins.findById(adminId);
      await admin.deleteOne();
      res.status(200).send({ message: "deleted" });
    }
  } catch (e) {
    new errorHandler(res, 500, 0);
  }
};

const removeUser = async (req, res) => {
  try {
    if (isAdmin(req)) {
      const { id } = req.body;
      const user = await User.findByIdAndDelete(id);

      res.status(200).send({ message: "deleted" });
    }
  } catch (e) {
    new errorHandler(res, 500, 0);
  }
};

const getAllUser = async (req, res) => {
  try {
    if (isAdmin(req)) {
      // Admin ise

      const users = await User.find();
      res.status(200).send({ users: users });
    }
  } catch (e) {
    new errorHandler(res, 500, 0);
  }
};

const getUserCount = async (req, res) => {
  try {
    if (isAdmin(req)) {
      // Admin ise

      const users = await User.countDocuments();
      res.status(200).send({ users: users });
    }
  } catch (e) {
    new errorHandler(res, 500, 0);
  }
};

const getSettings = async (req, res) => {
  try {
    const settings = await Settings.find().limit(1);
    res.status(200).send({ settings: settings[0] });
  } catch (e) {
    new errorHandler(res, 500, 0);
  }
};

const changeSettings = async (req, res) => {
  try {
    if (isAdmin(req)) {
      // Admin ise

      const {
        mainColor,
        secondColor,
        shareButton,
        profileColor,
        faqColor,
        savedColor,
        contact,
        navigationColor,
        pageBackgroundColor,
        share
      } = req.body;

      const settingsCount = await Settings.estimatedDocumentCount();
      if (settingsCount > 0) {
        const settings = await Settings.updateOne(
          {},
          {
            mainColor,
            secondColor,
            shareButton,
            profileColor,
            faqColor,
            savedColor,
            contact,
            navigationColor,
            pageBackgroundColor,
            share
          }
        );
        res
          .status(200)
          .send({ message: "updated", settingsCount: settingsCount });
      } else {
        const newSettings = new Settings({
          mainColor,
          secondColor,
          shareButton,
          profileColor,
          faqColor,
          savedColor,
          contact,
          navigationColor,
          pageBackgroundColor,
          share
        });
        newSettings.save();
        res.status(200).send({ message: "created" });
      }
    }
  } catch (e) {
    new errorHandler(res, 500, 0);
  }
};

const getPrices = async (req, res) => {
  try {
    let { lang } = req.body;
    if (!lang) lang = "en";

    if (lang == "all") {
      const prices = await Prices.find().sort({ month: 1 });
      res.status(200).send({ prices: prices });
    } else {
      const prices = await Prices.find({ lang: lang }).sort({ month: 1 });
      res.status(200).send({ price: prices, appstoreReview: config.appstoreReview });
    }
  } catch (e) {
    // console.log(e)
    new errorHandler(res, 500, 0);
  }
};

const changePrices = async (req, res) => {
  try {
    if (isAdmin(req)) {
      // Admin ise
      const {
        lang,
        month,
        price,
        priceId,
        currency,
        priceText,
        shopierId,
        priceContent,
        videos
      } = req.body;
      const updatePrice = await Prices.findByIdAndUpdate(priceId, {
        lang: lang,
        month: month,
        price: price,
        shopierId: shopierId,
        currency: currency,
        priceText: priceText,
        priceContent: priceContent,
        videos: videos
      });
      res.status(200).send({ message: "updated" });
    }
  } catch (e) {
    new errorHandler(res, 500, 0);
  }
};

const deletePrice = async (req, res) => {
  try {
    if (isAdmin(req)) {
      // Admin ise
      const { priceId } = req.body;
      const deletePrice = await Prices.findByIdAndDelete(priceId);
      res.status(200).send({ message: "deleted" });
    }
  } catch (e) {
    new errorHandler(res, 500, 0);
  }
};

const addPrices = async (req, res) => {
  try {
    if (isAdmin(req)) {
      // Admin ise
      const {
        lang,
        month,
        price,
        currency,
        priceText,
        priceContent,
        shopierId,
        videos
      } = req.body;
      const createPrice = new Prices({
        lang,
        month,
        price,
        shopierId,
        currency,
        priceText,
        priceContent,
        videos
      });
      await createPrice.save();
      res.status(200).send({ message: "created" });
    }
  } catch (e) {
    new errorHandler(res, 500, 0);
  }
};




module.exports = {

  adminLogin,
  addAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  getAllUser,
  changeSettings,
  getSettings,
  getPrices,
  changePrices,
  addPrices,
  deletePrice,
  getUserCount,
  removeUser,
};
