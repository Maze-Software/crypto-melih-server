const News = require('../Schemas/news')
const { checkMissingParams, checkLogin } = require('./general');
const errorHandler = require('./errorHandler');

const getNews = async (req, res) => {
    if (await !checkLogin(req)) { return new errorHandler(res, 401, -1) }
    res.send({ data: await News.find({}).sort({ created_at: -1 }) })
}


module.exports = {
    getNews
}