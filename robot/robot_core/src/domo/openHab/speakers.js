const fetch = require('node-fetch');
const logger = require('../../utils/logger')

const DEFAULT_STATE = {
  control: 'PAUSE',
  currentTitle: '',
  volume: 0,
};

function OHSpeakers(baseURL, speakerName, state = DEFAULT_STATE) {
  this.baseURL = baseURL;
  this.speakerName = speakerName;
  this.state = state;

  const that = this;

  // private function
  function fetchPost(itemSuffixe, body) {
    return fetch(`${that.baseURL}/items/${that.speakerName}${itemSuffixe}`, {
      method: 'POST',
      headers: { 'content-type': 'text/plain' },
      body,
    })
      .catch(error => logger.error(`OHSpeaker fetch : ${error}`));
  }

  this.play = function play() {
    return fetchPost('_Control', 'PLAY');
  };

  this.pause = function pause() {
    return fetchPost('_Control', 'PAUSE');
  };

  this.setVolume = function setVolume(volume) {
    return fetchPost('_Volume', `${volume}`);
  };

  this.playAudio = function playAudio(uri) {
    return fetchPost('_PlayURI', `${uri}`);
  };
}

module.exports = OHSpeakers;
