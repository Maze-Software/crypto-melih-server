
const express = require('express');
const mongoose = require('mongoose');
const route = express.Router();
const fileUpload = require('express-fileupload');
route.use(fileUpload());

route.get('/', async (req, res) => {
    res.send(req.protocol + '://' + req.get('host'))
})

route.post('/', async (req, res) => {
    let sampleFile;
    let uploadPath;
    const type = req.body.type;
    sampleFile = req.files.sampleFile;
    const randomName = makeid(10)

    if (!type) return res.status(500).send("parametre eksik")
    let folder = "";

    switch (type) {
        case "profileImage": folder = '/profileimages/'; break;
        case "news": folder = '/news/'; break;
    }
    const filePath = folder + randomName + sampleFile.name;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file

    var path = require("path");
    let reqPath = path.join(__dirname, '../uploads');
    uploadPath = reqPath + filePath;
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function (err) {
        if (err)
            return res.status(500).send(err);
        res.send({ message: "uploaded", url: req.protocol + '://' + req.get('host') + "/uploads" + filePath });
    });
});

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}


module.exports = route;