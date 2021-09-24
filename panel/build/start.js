const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, '')));

app.get('/ping', function (req, res) {
    return res.send('pong');
});



app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '', 'index.html'));
});
console.log("panel başladı")
app.listen(2121);