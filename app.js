const express = require("express");
require('core-js/stable');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const cors = require("cors")

mongoose.connect('mongodb://localhost:27017/webhook')
    .then(() => console.log("connected to mongoose"))
    .catch((error) => console.log(error))

// App
const app = express();
app.use(bodyParser.json())
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');



    // Pass to next layer of middleware
    next();
});
//app.use(cors({origin: 'http://localhost:3000'}));

const port = process.env.PORT || 4567;
app.set("port", port);


const Ping = mongoose.model('ping', new mongoose.Schema({
    payload: Object
}))

app.get('/', async (req, res) => {
    res.send(await Ping.find().sort('payload'))
})
app.post('/', async (req, res) => {
    let ping = new Ping({
        payload: req.body
    })
    ping = await ping.save()
    res.status(200).send({
        message: ping
    });
})
// Server
app.listen(port, () => console.log(`Server running on localhost:${port}`));