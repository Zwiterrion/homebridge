
const EventEmitter = require('events');

const eventEmitter = new EventEmitter();


// the events that can be used
const events = {

  // for communication with the smart items
  domoEvents: {
    lampOn: 'lamp_on',
    lampOff: 'lamp_off',
  },

  // for communication with users
  userEvents: {
    voiceHeard: 'voice_heard',
    faceRecognize: 'face_recognize',
  },

  sse: {
    voiceSynthesis: 'sse_voice',
  },

};


module.exports = { eventEmitter, events };
