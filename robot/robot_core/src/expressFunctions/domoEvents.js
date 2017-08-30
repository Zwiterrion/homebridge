const logger = require('../utils/logger.js');
const { eventEmitter, events } = require('../events.js');

function lampSwitch(req, res) {
  const state = req.body.state;
  const event = state === 'on' ? events.domoEvents.lampOn : events.domoEvents.lampOff;
  logger.info(event);
  eventEmitter.emit(event);
  res.send('operation finished');
}

module.exports = lampSwitch;
