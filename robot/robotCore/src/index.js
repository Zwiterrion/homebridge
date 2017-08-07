var OHLamp = require('./domo/openHab/lamp');
var OHSpeakers = require('./domo/openHab/speakers');

const OPENHAB_URL = 'http://192.168.86.55:8080';

let lamp2 = new OHLamp(
	`${OPENHAB_URL}/rest`,
	'hue_0210_0017886830d3_2'
);

let play1 = new OHSpeakers(
	`${OPENHAB_URL}/rest`,
	'sonos_PLAY1_RINCON_949F3E8C3E8001400'
);


// timeout with promise
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}


lamp2.turnOn().then(
	()=> sleep(2000)
).then(
	()=>lamp2.setColor(45,100,23)
).then(
	()=> sleep(5000)
).then(
	()=>lamp2.turnOff()
);
