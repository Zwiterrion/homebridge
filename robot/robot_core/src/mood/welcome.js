const { eventEmitter, events } = require('../events.js');
const logger = require('../utils/logger.js');
const Voicerss = require('../api/tts/voicerss.js');
const Voicer = require('../userInteractions/voiceSynth.js');
const personDb = require('../model/people');
const scenario = require('../scenario.js');

const voicer = new Voicer(new Voicerss());

function bindEvents() {
  eventEmitter.on(events.domoEvents.lampOn, () => {
    logger.debug('A lamp has been switched on');
  });

  eventEmitter.on(events.domoEvents.lampOff, () => logger.info('A lamp has been switched off'));

  eventEmitter.on(events.userEvents.faceRecognize, (faces) => {
    logger.debug(`faces recognize : ${faces.map(face => face.name)}`);

    // just for a person for the moment
    if (faces.length >= 1) {
      logger.debug(`isRegister : ${faces[0].id}=>${personDb.isRegister(faces[0].id)}`);
      if (personDb.isRegister(faces[0].id)) {
        logger.info('Person already registered');
        const favColor = personDb.getFavoriteColor(faces[0].id);
        logger.info(`Your favorite color is : ${favColor}`);
        scenario.setLampColor(favColor);
      } else {
        const nameArray = faces[0].name.split(' ');
        logger.info(`Adding ${faces[0].name} to storage`);
        personDb.addPerson(faces[0].id, nameArray[0], nameArray[1], 'bleu');
        voicer.sendToSpeechUI(`Bonjour ${faces[0].name}. Quelle est votre couleur préférée ?`);
      }
    }
  });
}

module.exports = bindEvents;

