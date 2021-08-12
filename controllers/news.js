const News = require('../Schemas/News')
const { checkMissingParams, checkLogin } = require('./General');
const errorHandler = require('./ErrorHandler');

const getNews = async (req, res) => {
    if (await !checkLogin(req)) { return new errorHandler(res, 401, -1) }
    res.send({ data: await News.find({}).sort({ created_at: -1 }) })
}


module.exports = {
    getNews
}