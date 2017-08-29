const { eventEmitter, events } = require('../events.js')
const logger = require('../utils/logger.js');

function bindEvents(){
    eventEmitter.on(events.domoEvents.lampOn, () => {
        logger.info('A lamp has been switched on')
        eventEmitter.emit('sse', events.sse.voiceSynthesis, "coucou")
    })
    eventEmitter.on(events.domoEvents.lampOff, () => logger.info('A lamp has been switched off'))
    eventEmitter.on(events.userEvents.faceRecognize, ( faces ) => logger.info(`faces recognize : ${ faces.map( (face) => face.name)}`))
}

module.exports = bindEvents;

