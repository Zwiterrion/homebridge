const SIMPLE_COLORS = require('./../config/colors/simpleColors.json');
const EXTENDED_COLORS = require('./../config/colors/extendedColors.json');

const COLORS = Object.assign({}, SIMPLE_COLORS, EXTENDED_COLORS);

// object and APIs
const OHLamp = require('./domo/openHab/lamp');
const OHSpeakers = require('./domo/openHab/speakers');

const OPENHAB_URL = 'http://192.168.86.55:8080';

const lamp2 = new OHLamp(
  `${OPENHAB_URL}/rest`,
  'HueColorLamp2'
);

const play1 = new OHSpeakers(
  `${OPENHAB_URL}/rest`,
  'SonosPLAY1'
);

const scenario = {
  setLampColor(color) {
    lamp2.setColor(COLORS[color]);
  },

  turnLampOff() {
    lamp2.turnOff();
  },

  turnLampOn() {
    lamp2.turnOn();
  }
};

module.exports = scenario;
