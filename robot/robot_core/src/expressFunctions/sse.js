const logger = require('../utils/logger.js');
const { eventEmitter, events } = require('../events.js');

const startSees = {

  subscribers: [],

  subscribe(res) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.write('\n');
    logger.info(`push the data : ${res} in ${this.subscribers}`);
    this.subscribers.push(res);
  },

  sseEventListen() {
    const that = this;
    eventEmitter.on('sse', (name, text) => {
      that.subscribers.forEach((res) => {
        res.write(`event: ${name}\n`);
        res.write(`data: ${text}\n\n`);
      });
    });
  },

};

module.exports = startSees;
