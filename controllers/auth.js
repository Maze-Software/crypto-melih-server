const User = require('../schemas/user');
var validator = require('validator');
const errorHandler = require('./errorHandler');
const { checkMissingParams, checkLogin, activeUserSubscription } = require('./general');
const bcrypt = require('bcryptjs');
const config = require('../config.json');
var jwt = require('jsonwebtoken');

function generateReferralCode(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function firstNameValidator(firstName, res) {
    const length = validator.isByteLength(firstName, { min: 2, max: 20 }) // length should be between 4 and 10
    const regex = validator.matches(firstName, /^[a-zA-Z0-9ğüşöçİıĞÜŞÖÇ]+$/g); // should contains at least 1 char (letter)
    if (!length) new errorHandler(res, 500, 4);
    if (!regex) new errorHandler(res, 500, 5);
    return length && regex;
}

function lastNameValidator(lastName, res) {
    const length = validator.isByteLength(lastName, { min: 2, max: 20 }) // length should be between 4 and 10
    const regex = validator.matches(lastName, /^[a-zA-Z0-9ğüşöçİıĞÜŞÖÇ]+$/g); // should contains at least 1 char (letter)
    if (!length) new errorHandler(res, 500, 6);
    if (!regex) new errorHandler(res, 500, 7);
    return length && regex;
}
function passwordValidator(password, res) {
    const regex = validator.matches(password, /^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{8,25}$/g)
    if (!regex) new errorHandler(res, 500, 8);
    return regex;
}
async function emailValidator(email, res) {
    const isEmail = validator.isEmail(email);
    const already = await isEmailAlready(email);

    if (already) new errorHandler(res, 500, 10);
    if (!isEmail) new errorHandler(res, 500, 11);


    return !already && isEmail


}
function CapitalizeString(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLocaleLowerCase()
}

const createJWT = (email, userId) => {
    var JWT = jwt.sign({ email: email, type: 'user', userId: userId }, config.privateKey);
    return JWT;
}


async function isEmailAlready(email) {
    return await User.findOne({ email: email }) ? true : false
}

// Methods



const registerUser = async (req, res) => {


    if (!req.cookies.token) {
        const params = [
            'username',
            'firstName',
            'lastName',
            'email',
            'password',
            'phone'
        ];

        if (!checkMissingParams(params, req, res)) return;

        let { username, firstName, lastName, email, password, phone, promotionEmail = false, referralCode = false } = req.body;



        const check = await User.exists({ $or: [{ username }, { email }] })
        if (check) { return res.status(500).send({ message: "username or email already exist" }) }

        firstName = CapitalizeString(firstName);
        lastName = CapitalizeString(lastName);
        email = email.toLowerCase();
        if (
            firstNameValidator(firstName, res) &&
            lastNameValidator(lastName, res) &&
            passwordValidator(password, res) &&
            await emailValidator(email, res)
        ) {

            let referralCodeGenerated = generateReferralCode(7);
            while (await User.exists({ referralCode: referralCodeGenerated })) {
                referralCodeGenerated = generateReferralCode(7);
            }

            const newUser = await new User({
                username,
                firstName,
                lastName,
                email,
                hash: bcrypt.hashSync(password, 12),
                promotionEmail,
                phone,
                referralCode: referralCodeGenerated
            }); save(); // Insert to database


            const token = createJWT(email, newUser._id) // Create token
            res.cookie('token', token); // set token to the cookie

            if (referralCode) {
                const whooseCode = await User.findOne({ referralCode });
                if (whooseCode) {
                    await activeUserSubscription(1, whooseCode._id)
                    await activeUserSubscription(1, newUser._id)
                }
            }


            res.status(200).send({ message: "User registered successfully", token: token, user: newUser }) // send response;




        }


    }
    else {
        res.status(500).send({ message: "You are already logged in" });
    }







};
const logOut = async (req, res) => {

    try {
        const token = req.body.token ? req.body.token : req.cookies.token;
        if (token) {
            var result = jwt.verify(token, config.privateKey);
            const user = await User.findOne({ email: result.email });
            global.socketUsers = global.socketUsers.filter(e => e.userId != user._id)
        }
        res.clearCookie('token');
        res.status(202).send({ message: 'Log Outed Successfully' })
    }
    catch (e) {
        res.send("ok");
    }

};
const refreshToken = async (req, res) => {
    try {
        const token = req.body.token ? req.body.token : req.cookies.token;

        if (token) {
            var result = jwt.verify(token, config.privateKey);
            const user = await User.findOne({ email: result.email })


            if (user) {
                res.cookie('token', token);
                res.status(200).send({ user: user })
            }
            else {
                new errorHandler(res, 500, 0)
            }
        }
        else {
            new errorHandler(res, 500, 0)
        }
    }
    catch (e) {
        new errorHandler(res, 500, 0)
    }

}
const login = async (req, res) => {


    if (await checkLogin(req) == false) {
        const { email, password } = req.body;
        const userByEmail = await User.findOne({ email: email });
        if (userByEmail) {
            const comparePassword = await bcrypt.compare(password, userByEmail.hash)
            const token = createJWT(email, userByEmail._id);
            if (comparePassword) {
                res.cookie('token', token); // set token to the cookie
                res.status(200).send({ token: token, user: userByEmail })
            }
            else {
                new errorHandler(res, 500, 13)
            }
        }
        else {
            new errorHandler(res, 404, 13)
        }

    }
    else {
        const user = await checkLogin(req);
        res.status(200).send({ token: req.cookies.token, user: user })
    }



};

module.exports = {
    login,
    logOut,
    registerUser,
    refreshToken,
}