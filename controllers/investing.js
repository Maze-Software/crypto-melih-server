const Investing = require('../schemas/investing')
const { checkMissingParams, checkLogin } = require('./general');
const errorHandler = require('./errorHandler');
const Axios = require('axios').default

const setInvesting = async (req, res) => {
    const getUser = await checkLogin(req);
    const { coinType,
        amount,
        price,
        note,
        currency,


    } = req.body;

    const createInvesting = await new Investing({
        coinType,
        amount,
        price,
        note,
        currency,
        userId: getUser._id

    }).save();
    res.status(200).send({ message: "ok", data: createInvesting })

}
const getUserInvesting = async (req, res) => {
    const getUser = await checkLogin(req);
    if (!getUser) { return new errorHandler(res, 401, -1) }
    const getAlarm = await Investing.find({ userId: getUser._id, })
    res.status(200).send({ data: getAlarm })

}
const deleteInvesting = async (req, res) => {
    const getUser = await checkLogin(req);
    const { investingId } = req.body;
    if (!getUser || !investingId) { return new errorHandler(res, 401, -1) }
    const getAlarm = await Investing.findByIdAndDelete(investingId)
    res.status(200).send({ message: "deleted" })

}

module.exports = {
    setInvesting,
    getUserInvesting,
    deleteInvesting
}