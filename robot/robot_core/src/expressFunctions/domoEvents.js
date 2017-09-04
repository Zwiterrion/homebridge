const logger = require('../utils/logger.js');
const { eventEmitter, events } = require('../events.js');

function lampSwitch(req, res) {
  const state = req.body.state;
  const event = state === 'on' ? events.domoEvents.lampOn : events.domoEvents.lampOff;
  eventEmitter.emit(event);
  logger.debug(`Emitting event for a lamp that has been switch ${state}`);
  res.send('operation finished');
}

module.exports = lampSwitch;
