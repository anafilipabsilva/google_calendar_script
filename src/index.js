const { SyncController } = require('./controllers/sync.controller')

const port = 3000

const controller = new SyncController();
controller.start(port);
