const express = require('express');
const { GoogleAuthenticationClient } = require('./../gateways/authentication.client')
const { SyncCalendar } = require('./../interactors/sync.calendar')

const app = express()
const client = GoogleAuthenticationClient.getInstance();
const calendar = new SyncCalendar();

class SyncController {

    start(address, port) {
        app.get('/sync', async (req, res) => {
            if (client.accessToken == null) {
                res.redirect(client.authenticationUrl(address));
                return;
            }

            await calendar.sync(client.accessToken);

            res.send('Process finished with success');
        })

        app.get('/auth/callback', async (req, res) => {
            try {
                await client.getToken(req.query.code, address);
                res.redirect('/sync');
                return;

            } catch (error) {
                console.log('Access Token Error', error.message);
            }
        })

        app.listen(port, () => {
            console.log(`App listening at ${address}`)
        })
    }
}

module.exports.SyncController = SyncController;
