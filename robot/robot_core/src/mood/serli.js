const { eventEmitter, events } = require('../events.js');
const Voicerss = require('../api/tts/voicerss.js');
const Voicer = require('../userInteractions/voiceSynth.js');

const voicer = new Voicer(new Voicerss());

function bindEvents() {
  eventEmitter.on(events.domoEvents.lampOn, () => {
    voicer.sendToSpeechUI('Ho, la lampe s\'est alluméee');
  });
}

module.exports = bindEvents;
