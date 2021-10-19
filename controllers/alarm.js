const Alarm = require('../schemas/cryptoalarm')
const { checkMissingParams, checkLogin, sendPushNotification } = require('./general');
const errorHandler = require('./errorhandler');
const Axios = require('axios').default

const setAlarm = async (req, res) => {
    const getUser = await checkLogin(req);
    const { currency, lowerBound, upperBound, moneyCurrency } = req.body;
    const type = lowerBound ? 0 : 1;
    if (!getUser) { return new errorHandler(res, 401, -1) }
    if (!currency || (!lowerBound && !upperBound)) { return new errorHandler(res, 500, 1) }
    // const checkExist = await Alarm.exists({
    //     active: true,
    //     userId: getUser._id,
    //     currency,
    //     type
    // })
    // if (checkExist) {
    //     return res.status(500).send({ message: "Alarm zaten kurulmuş" })
    // }

    const createAlarm = await new Alarm({
        active: true,
        userId: getUser._id,
        currency,
        upperBound,
        lowerBound,
        moneyCurrency,
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

    const data = await Axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd')
    const rate = global.exchangeRate.rates["TRY"]
    const list = data.data
    // buraya currency koşullarnı da ekle ve çarpılmış hakşnş gönder
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

    if (getAlarm.length > 0) {
        for await (const alarm of getAlarm) {
            await sendPushNotification(alarm.userId, {
                data: { "parentPage": "TrackerScreen", "childPage": "AlarmsScreen" },
                title: `${alarm.currency.toUpperCase()} ${alarm.lowerBound ? alarm.lowerBound : alarm.upperBound} Alarmı`,
                body: `Tetiklenen alarm ${alarm.currency.toUpperCase()} ${alarm.lowerBound ? alarm.lowerBound : alarm.upperBound} seviyesinin ${alarm.lowerBound ? "altına indi" : "üstüne çıktı"}`,
                message: `Tetiklenen alarm ${alarm.currency.toUpperCase()} ${alarm.lowerBound ? alarm.lowerBound : alarm.upperBound} seviyesinin ${alarm.lowerBound ? "altına indi" : "üstüne çıktı"}`

            })
        }
        await Alarm.deleteMany(query)
    }
    // console.log(getAlarm.map(e => e.userId), "Alarmlar Gönderildi")}

    // Remove Alarms



}

module.exports = {
    setAlarm,
    getUserAlarm,
    alarmHandler,
    deleteAlarm
}