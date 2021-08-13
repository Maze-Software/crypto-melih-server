const News = require('../Schemas/news')
const { checkMissingParams, checkLogin, isAdmin } = require('./general');
const errorHandler = require('./errorHandler');

const getNews = async (req, res) => {
    if (await !checkLogin(req)) { return new errorHandler(res, 401, -1) }
    res.send({ data: await News.find({}).sort({ created_at: -1 }) })
}

const addNews = async (req, res) => {
    if (await !isAdmin(req)) { return new errorHandler(res, 401, -1) }
    const { title, content, image, link } = req.body;
    const addNews = await new News({ title, content, image, link }).save();
    res.send({ data: addNews })
}

const updateNews = async (req, res) => {
    if (await !isAdmin(req)) { return new errorHandler(res, 401, -1) }
    const { title, content, image, link, newsId } = req.body;
    const changeObj = {};
    if (title) changeObj.title = title;
    if (content) changeObj.content = content;
    if (image) changeObj.image = image;
    if (link) changeObj.link = link;

    const editNews = await News.findByIdAndUpdate(newsId, changeObj)
    res.send({ data: editNews })
}

const deleteNews = async (req, res) => {
    if (await !isAdmin(req)) { return new errorHandler(res, 401, -1) }
    const { newsId } = req.body;
    const editNews = await News.findByIdAndDelete(newsId)
    res.send({ data: editNews })
}


module.exports = {
    getNews,
    addNews,
    updateNews,
    deleteNews
}