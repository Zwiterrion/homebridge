const logger = require('../utils/logger.js');
const { eventEmitter, events } = require('../events.js')

const startSees = {

    subscribers : [],

    subscribe: function (res) {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
        res.write("\n");
        logger.info(`push the data : ${res} in ${this.subscribers}`);
        this.subscribers.push(res);
    },

    sseEventListen: function () {
        let that = this;
        eventEmitter.on('sse', function (name, text) {
            that.subscribers.forEach(function (res) {
                res.write("event: " + name + "\n");
                res.write("data: " + text + "\n\n");
            })
        });
    }

}

module.exports = startSees;