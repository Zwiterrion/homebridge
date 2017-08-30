const fetch = require('node-fetch');
const querystring = require('querystring');
// const util = require('util');

const API_KEY = 'b29c66ace5c74a4d8150cd95b6819725';
const API_URI = 'http://api.voicerss.org/';
const LANGUAGE = 'fr-fr';

function Voicerss() {
  //= =============================================================================
  this.textToSpeech = function textToSpeech(text) {
    const params = {
      key: API_KEY,
      hl: LANGUAGE,
      src: text,
      r: 0,
      c: 'mp3',
      f: '44khz_16bit_stereo',
      ssml: false,
      b64: false,
    };

    return fetch(`${API_URI}?${querystring.stringify(params)}`, {
      method: 'GET',
    }).then(content => content.url);
  };
}

module.exports = Voicerss;
