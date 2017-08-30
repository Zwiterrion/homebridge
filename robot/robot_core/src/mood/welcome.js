const { eventEmitter, events } = require('../events.js');
const logger = require('../utils/logger.js');
const Voicerss = require('../api/tts/voicerss.js');
const Voicer = require('../userInteractions/voiceSynth.js');

const voicer = new Voicer(new Voicerss());

function bindEvents() {
  eventEmitter.on(events.domoEvents.lampOn, () => {
    logger.info('A lamp has been switched on');
    // eventEmitter.emit('sse', events.sse.voiceSynthesis, "coucou")
  });

  eventEmitter.on(events.domoEvents.lampOff, () => logger.info('A lamp has been switched off'));

  eventEmitter.on(events.userEvents.faceRecognize, (faces) => {
    logger.info(`faces recognize : ${faces.map(face => face.name)}`);
    // eventEmitter.emit(events.userEvents.voiceSynthesis,
    //   `Bonjour ${faces[0].name}. Quel est votre couleur préférée ?`);
    voicer.sendToSpeechUI(`Bonjour ${faces[0].name}. Quel est votre couleur préférée ?`);
  });
}

module.exports = bindEvents;

