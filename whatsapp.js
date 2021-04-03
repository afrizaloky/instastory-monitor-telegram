const {create,Client} = require('@open-wa/wa-automate')
const {options} = require('./util.js')
const scheduleHandler = require('./handler/schedule');
const ownerPhone = '628986657752@c.us'




const start = (client = new Client()) => {
    console.log('[CLIENT] CLIENT Started!')
    client.sendText(ownerPhone, 'Client Started!')
    scheduleHandler(client)

}

create(options(true, start))
    .then((client) => start(client))
    .catch((err) => new Error(err))
