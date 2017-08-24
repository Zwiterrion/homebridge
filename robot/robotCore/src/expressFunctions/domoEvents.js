const winston = require('winston');
const util = require('util');
const {eventEmitter, events} = require('../events.js')

function lampSwitch(req, res) {
    res.send("operation finished");
    let state = req.body.state;
    let event = state === 'on' ? events.domoEvents.lampOn : events.domoEvents.lampOff
    winston.info(event);
    eventEmitter.emit(event);
}

module.exports = lampSwitch