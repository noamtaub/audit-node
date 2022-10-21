# Getting Started with AudITech


## Quick start

- Clone the repo: `git clone https://github.com/noamtaub/audit-node.git`
- Move to folder: `cd audit-node`
- Install with [npm](https://www.npmjs.com/): `npm install`
- Connect to MongoDB Compass: [mongoDB](https://www.mongodb.com/try/download/compass)
- Import file `pings.json` in the root directory to `webhook` db into  collection `pings`
- Run `node app.js`
- Download ngrok for remote server [ngrok](https://ngrok.com/download)
- Sign up to ngrok and get token [signup](https://dashboard.ngrok.com/signup)
- Open ngrok app from zip file and run `$ ngrok config add-authtoken <YOUR_TOKEN>`
- Start a tunnel: `ngrok http 4567`
- Copy the link you get, and pase it [here](https://github.com/noamtaub/audit-node/settings/hooks/384620307) and click update webhook
![Alt text](/CaptureNgrok.PNG)
![Alt text](/CaptureWebhook.PNG)

![Alt text](/CaptureMongoDB.PNG)

