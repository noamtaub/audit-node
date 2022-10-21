const dotenv = require('dotenv')
const express = require("express");
require('core-js/stable');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const cors = require("cors")
const crypto = require('crypto');
const puppeteer = require('puppeteer');

mongoose.connect('mongodb://localhost:27017/webhook')
    .then(() => console.log("connected to mongoose"))
    .catch((error) => console.log(error))

// App
const app = express();
app.use(bodyParser.json())
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next();
});
app.use(cors({origin: '*'}));

const port = process.env.PORT || 4567;
app.set("port", port);


const Ping = mongoose.model('ping', new mongoose.Schema({
    payload: Object,
    path: String
}))

dotenv.config()
const sigHeaderName = 'X-Hub-Signature-256'
const sigHashAlg = 'sha256';

app.get('/', async (req, res) => {
    res.send(await Ping.find())
})
app.post('/', verifyPayload, async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(req.body.pull_request.html_url);

    page.setViewport({width: 1040, height: 500})
    const base64 = await page.screenshot({encoding: "base64"})

    let ping = new Ping({
        payload: req.body,
        path: base64
    })
    ping = await ping.save()
    res.status(200).send({
        message: ping
    });
    await browser.close();
})

app.use((err, req, res, next) => {
    if (err) {
        console.error(err);
    }
    res.status(403).send('Request body was not signed or verification failed');
});

function verifyPayload(req, res, next) {
    if (!req.body) {
        return next('Request body empty')
    }

    const data = JSON.stringify(req.body);
    const sig = Buffer.from(req.get(sigHeaderName) || '', 'utf8');
    const hmac = crypto.createHmac(sigHashAlg, process.env.SECRET);
    const digest = Buffer.from(`${sigHashAlg}=${hmac.update(data).digest('hex')}`, 'utf8');
    if (sig.length !== digest.length || !crypto.timingSafeEqual(digest, sig)) {
        return next(`Request body digest (${digest}) did not match ${sigHeaderName} (${sig})`);
    }
    return next()
}

app.listen(port, () => console.log(`Server running on localhost:${port}`));