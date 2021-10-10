require('dotenv').config();

const { SyncController } = require('./controllers/sync.controller');
const localtunnel = require('localtunnel');

(async () => {
    const port = 3000;
    const tunnel = await localtunnel({ port, subdomain: process.env.SUBDOMAIN });

    const controller = new SyncController();
    controller.start(tunnel.url, port);
})();       
