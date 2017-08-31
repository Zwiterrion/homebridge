const { eventEmitter, events } = require('../events.js');
const logger = require('../utils/logger.js');
const Voicerss = require('../api/tts/voicerss.js');
const Voicer = require('../userInteractions/voiceSynth.js');
const personDb = require('../model/people');

const voicer = new Voicer(new Voicerss());

function bindEvents() {
  eventEmitter.on(events.domoEvents.lampOn, () => {
    logger.info('A lamp has been switched on');
  });

  eventEmitter.on(events.domoEvents.lampOff, () => logger.info('A lamp has been switched off'));

  eventEmitter.on(events.userEvents.faceRecognize, (faces) => {
    logger.info(`faces recognize : ${faces.map(face => face.name)}`);

    // just for a person for the moment
    if (faces.length === 1) {
      const nameArray = faces[0].name.split(' ');
      logger.info(`Adding ${faces[0].name} to storage`);
      personDb.addPerson(faces[0].id, nameArray[0], nameArray[1], 'blue');
    }


    voicer.sendToSpeechUI(`Bonjour ${faces[0].name}. Quel est votre couleur préférée ?`);
  });
}

module.exports = bindEvents;

