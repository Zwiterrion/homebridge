// the events that can be used

const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

const events = {

	// domotique events
	domoEvents : {
		lampOn : "lamp_on",
		lampOff : "lamp_off",
	},

	userEvents : {
		voiceHeard : "voice_heard",
		faceRecognize : "face_recognize"
	},

	sse : {
		voiceSynthesis : "sse_voice"
	},


}


module.exports = { eventEmitter, events };
