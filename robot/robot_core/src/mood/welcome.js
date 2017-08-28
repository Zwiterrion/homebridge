const { eventEmitter, events } = require('../events.js')
const logger = require('../utils/logger.js');

function bindEvents(){
    eventEmitter.on(events.domoEvents.lampOn, () => logger.info('A lamp has been switched on'))
    eventEmitter.on(events.domoEvents.lampOff, () => logger.info('A lamp has been switched off'))
}

module.exports = bindEvents;

