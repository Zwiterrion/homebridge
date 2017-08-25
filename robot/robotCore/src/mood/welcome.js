const { eventEmitter, events } = require('./events.js')
const winston = require('winston');

function bindEvents(){
    eventEmitter.on(events.domoEvents.lampOn, () => winston.info('A lamp has been switched on'))
}

export default bindEvents;

