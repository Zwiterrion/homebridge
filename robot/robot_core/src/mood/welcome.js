const { eventEmitter, events } = require('../events.js');
const logger = require('../utils/logger.js');
const Voicerss = require('../api/tts/voicerss.js');
const Voicer = require('../userInteractions/voiceSynth.js');
const personDb = require('../model/model');
const scenario = require('../scenario.js');
const { possibleContext, Context } = require('../context');

const TIMEOUT_FOR_COLOR_CHOOSE = 30000; // => 30s
const voicer = new Voicer(new Voicerss());

function bindEvents() {
  eventEmitter.on(events.domoEvents.lampOn, () => {
    logger.debug('A lamp has been switched on');
  });

  eventEmitter.on(events.domoEvents.lampOff, () => logger.info('A lamp has been switched off'));

  eventEmitter.on(events.userEvents.faceRecognize, (faces) => {
    logger.debug(`faces recognize : ${faces.map(face => face.name)}`);
    logger.debug(`current context: ${Context.getCurrentContextName()}`);
    //  process people faces only if we're in the default context
    if (Context.getCurrentContextName() === possibleContext.NONE) {
      logger.debug('processing person');
      if (faces.length >= 1) {
        if (personDb.isPersonRegister(faces[0].id)) {
          logger.info('Person already registered');
          if (!personDb.isPersonSeen(faces[0].id)) {
            logger.debug('Person not seen yet');
            personDb.checkPersonAsSeen(faces[0].id);
            const favColor = personDb.getFavoriteColor(faces[0].id);
            logger.info(`Your favorite color is : ${favColor}`);
            voicer.sendToSpeechUI(`Bonjour ${faces[0].name}. Je met votre couleur préférée! ?`);
            scenario.setLampColor(favColor);
          }
        } else {
          logger.debug(`Registering a new person named : ${faces[0].name}`);
          const nameArray = faces[0].name.split(' ');
          if (!nameArray[1]) nameArray[1] = ''; // case only a firstname


          const personData = {
            id: faces[0].id,
            firstName: nameArray[0],
            lastName: nameArray[1],
            alreadySeen: true
          };

          // we change the context for the color one
          Context.change(possibleContext.CHOOSING_COLOR, personData, null, null, TIMEOUT_FOR_COLOR_CHOOSE);
          voicer.sendToSpeechUI(`Bonjour ${faces[0].name}. Quelle est votre couleur préférée ?`);
        }
      }
    }
    // just for a person for the moment
    
  });
}

module.exports = bindEvents;

