const logger = require('../utils/logger.js');
const {eventEmitter, events} = require('../events.js')

function lampSwitch(req, res) {
    let state = req.body.state;
    let event = state === 'on' ? events.domoEvents.lampOn : events.domoEvents.lampOff
    logger.info(event);
    eventEmitter.emit(event);
    res.send("operation finished");
}

module.exports = lampSwitch