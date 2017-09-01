const logger = require('../utils/logger.js');
const { eventEmitter, events } = require('../events.js');

const startSees = {

  subscribers: [],

  subscribe(req, res) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.write('\n');
    this.subscribers.push(res);
    req.on('close', () => {
      logger.debug('sse : a connection has been closed');
      const index = this.subscribers.indexOf(res);
      this.subscribers.splice(index, 1);
    });
    logger.debug('sse : subscribe done');
  },

  sseEventListen() {
    const that = this;
    eventEmitter.on('sse', (name, text) => {
      that.subscribers.forEach((res) => {
        res.write(`event: ${name}\n`);
        res.write(`data: ${text}\n\n`);
      });
      logger.debug(`sse fired with event : ${name}, and data : ${text}`);
    });
  },

};

module.exports = startSees;
