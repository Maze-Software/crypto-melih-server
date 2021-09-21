const Alarm = require('../schemas/cryptoalarm')
const { checkMissingParams, checkLogin } = require('./general');
const errorHandler = require('./errorhandler');
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
        return res.status(500).send({ message: "Alarm zaten kurulmuş" })
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
const deleteAlarm = async (req, res) => {
    const getUser = await checkLogin(req);
    const { alarmId } = req.body;
    if (!getUser || !alarmId) { return new errorHandler(res, 401, -1) }
    const getAlarm = await Alarm.findByIdAndDelete(alarmId)
    res.status(200).send({ message: "deleted" })

}
const alarmHandler = async () => {

    const data = await Axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=try')
    const list = data.data
    const query = {
        active: true, $or: list.map(e => new Object(
            {
                $or: [
                    {
                        lowerBound: { $gte: e.current_price },
                        currency: e.symbol
                    },
                    {
                        upperBound: { $lte: e.current_price },
                        currency: e.symbol
                    }
                ]

            }
        ))
    };
    const getAlarm = await Alarm.find(query)

    // TODO : send notification
    if (getAlarm.length > 0)
        console.log(getAlarm.map(e => e.userId), "Alarmlar Gönderildi")

    // Remove Alarms
    await Alarm.deleteMany(query)


}

module.exports = {
    setAlarm,
    getUserAlarm,
    alarmHandler,
    deleteAlarm
}