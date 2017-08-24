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
	},


}


module.exports = { eventEmitter ,events };
