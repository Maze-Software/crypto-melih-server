const Alarm = require('../schemas/cryptoalarm')
const { checkMissingParams, checkLogin } = require('./general');
const errorHandler = require('./ErrorHandler');
const Axios = require('axios').default

const setAlarm = async (req, res) => {
    const getUser = await checkLogin(req);
    const { currency, lowerBound, upperBound } = req.body;
    const type = lowerBound ? 0 : 1;
    if (!getUser) { return new errorHandler(res, 401, -1) }
    if (!currency || (!lowerBound && !upperBound)) { return new errorHandler(res, 500, 1) }
    const checkExist = await Alarm.exists({
        active: true,
        userId: getUser._id,
        currency,
        type
    })
    if (checkExist) {
        return res.status(500).send({ message: "Alarm already exists" })
    }
    const createAlarm = await new Alarm({
        active: true,
        userId: getUser._id,
        currency,
        upperBound,
        lowerBound,
        type, // 0 lower 1 upper
    }).save();
    res.status(200).send({ message: "alarm setted", data: createAlarm })

}
const getUserAlarm = async (req, res) => {
    const getUser = await checkLogin(req);
    if (!getUser) { return new errorHandler(res, 401, -1) }
    const getAlarm = await Alarm.find({ userId: getUser._id, })
    res.status(200).send({ data: getAlarm })

}

const tracker = async (req, res) => {

    const data = await Axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=try')
    const list = data.data
    // const getAlarm = await Alarm.find({ active: true, })
    // res.status(200).send({ data: getAlarm })

}



module.exports = {
    setAlarm,
    getUserAlarm,
    tracker
}