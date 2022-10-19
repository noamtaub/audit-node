const express = require("express");
const routes = require("./routes");
require('core-js/stable');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/audit')
    .then(()=> console.log("connected to mongoose"))
    .catch((error) => console.log(error))


// App
const app = express();
app.post('/', (req, res) => {
    console.log(req.body);

    res.status(200).send({
            message: "Webhook Event successfully logged"
        });
})

const sigHeaderName = 'X-Hub-Signature-256';
const sigHashAlg = 'sha256';
const secret = "ABC123";

//
// app.use(bodyParser.json(
//     {
//       verify: (req, res, buf, encoding) => {
//         if (buf && buf.length) {
//           req.rawBody = buf.toString(encoding || 'utf8');
//         }
//       },
//     }
// ));


// Set port
const port = process.env.PORT || 4567;
app.set("port", port);

// Database Setup
// const dbSetup = async (req, res, next) => {
//   if (!req.db) {
//     const db = await startDatabase();
//     req.db = db;
//   }
//
//   next();
// };
//
// app.use(dbSetup);

//Validate payload
/* function validatePayload(req, res, next) {

    if(req.method == "POST"){
        if (!req.rawBody) {
            return next('Request body empty')
        }

        const sig = Buffer.from(req.get(sigHeaderName) || '', 'utf8')
        const hmac = crypto.createHmac(sigHashAlg, secret)
        const digest = Buffer.from(sigHashAlg + '=' + hmac.update(req.rawBody).digest('hex'), 'utf8');

        if (sig.length !== digest.length || !crypto.timingSafeEqual(digest, sig)) {
            return next(`Request body digest (${digest}) did not match ${sigHeaderName} (${sig})`)
        }
    }

    return next()

}
app.use(validatePayload); */
app.use('/', routes);

// Server
app.listen(port, () => console.log(`Server running on localhost:${port}`));