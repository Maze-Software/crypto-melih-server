const Investing = require('../schemas/investing')
const { checkMissingParams, checkLogin } = require('./general');
const errorHandler = require('./errorhandler');
const Axios = require('axios').default

const setInvesting = async (req, res) => {
    const getUser = await checkLogin(req);
    const { coinType,
        amount,
        price,
        note,
        currency,
        date

    } = req.body;

    const createInvesting = await new Investing({
        coinType,
        amount,
        price,
        note,
        currency,
        userId: getUser._id,
        date

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

const getTotalInvesting = async (req, res) => {

    const getUser = await checkLogin(req);
    if (!getUser) { return new errorHandler(res, 401, -1) }
    let getAllInvestings = await Investing.find({ userId: getUser._id, }).lean()
    getAllInvestings = getAllInvestings.map(e => {
        const rate = global.exchangeRate.rates[e.currency.toUpperCase()]
        return new Object({ ...e, basePrice: e.price / rate })
    })
    const totalPrice = getAllInvestings.reduce((accumulator, item) => accumulator + item.basePrice, 0);
    const investings = getAllInvestings.map((item) => {
        return new Object({
            ...item,
            percentage: 100 * item.basePrice * item.amount / totalPrice
        })
    })

    let uniqueInvestings = []
    investings.forEach((e) => {
        const findIndex = uniqueInvestings.findIndex(q => q.currency == e.currency && q.coinType == e.coinType)
        if (findIndex > -1) {
            uniqueInvestings[findIndex] = {
                ...uniqueInvestings[findIndex],
                percentage: uniqueInvestings[findIndex].percentage + e.percentage,
                repetitive: uniqueInvestings[findIndex].repetitive + 1,
                totalAmount: uniqueInvestings[findIndex].amount + e.amount,
                totalPrice: uniqueInvestings[findIndex].price + e.price

            }
        }
        else {
            uniqueInvestings.push({ ...e, repetitive: 1, totalAmount: e.amount, totalPrice: e.price })
        }
    });

    res.status(200).send({ data: investings, totalPrice: totalPrice, uniqueInvestings: uniqueInvestings })
}
module.exports = {
    setInvesting,
    getUserInvesting,
    deleteInvesting,
    getTotalInvesting
}