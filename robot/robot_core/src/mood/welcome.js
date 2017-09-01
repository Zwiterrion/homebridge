const { eventEmitter, events } = require('../events.js');
const logger = require('../utils/logger.js');
const Voicerss = require('../api/tts/voicerss.js');
const Voicer = require('../userInteractions/voiceSynth.js');
const personDb = require('../model/people');

const voicer = new Voicer(new Voicerss());


// config
const SIMPLE_COLORS = require('../../config/colors/simpleColors.json');
const EXTENDED_COLORS = require('../../config/colors/extendedColors.json');

const COLORS = Object.assign({}, SIMPLE_COLORS, EXTENDED_COLORS);

// object and APIs
const OHLamp = require('../domo/openHab/lamp');

const OPENHAB_URL = 'http://192.168.86.55:8080';

const lamp2 = new OHLamp(
  `${OPENHAB_URL}/rest`,
  'HueColorLamp2'
)

function bindEvents() {
  eventEmitter.on(events.domoEvents.lampOn, () => {
    logger.info('A lamp has been switched on');
  });

  eventEmitter.on(events.domoEvents.lampOff, () => logger.info('A lamp has been switched off'));

  eventEmitter.on(events.userEvents.faceRecognize, (faces) => {
    logger.info(`faces recognize : ${faces.map(face => face.name)}`);

    // just for a person for the moment
    if (faces.length >= 1) {
      logger.info(`isRegister : ${faces[0].id}=>${personDb.isRegister(faces[0].id)}`);
      if (personDb.isRegister(faces[0].id)) {
        const favColor = personDb.getFavoriteColor(faces[0].id);
        logger.info('Person already registered');
        logger.info(`Your favorite color is : ${favColor}`);
        lamp2.setColor(COLORS[favColor]);
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

