const { eventEmitter, events } = require('../events.js');


class Voicer {
  constructor(voicerApi) {
    this.textToSpeech = voicerApi.textToSpeech;
  }

  sendToSpeechUI(text) {
    this.textToSpeech(text)
      .then(url =>
        eventEmitter.emit('sse', events.sse.voiceSynthesis, url)
      );
  }
}

module.exports = Voicer;
