const audioProcessing = require('../api/wit/witRequest.js');
const dispatcher = require('../dispatcher/dispatcher');
const Voicerss = require('../api/tts/voicerss.js');
const Voicer = require('../userInteractions/voiceSynth.js');
const logger = require('../utils/logger.js');

const voicer = new Voicer(new Voicerss());

function processAudio(req, res) {
  audioProcessing(req)
    .then(json => dispatcher(json.intent, json.entities))
    .then((result) => {
      res.json(result);
      logger.debug(`result of processAudio : ${result}`);
      voicer.sendToSpeechUI(result);
    });
}

module.exports = processAudio;
