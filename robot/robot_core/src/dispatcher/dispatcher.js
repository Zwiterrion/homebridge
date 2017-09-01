const fetch = require('node-fetch');
const scenario = require('../scenario.js');
const SIMPLE_COLORS = require('../../config/colors/simpleColors.json');
const EXTENDED_COLORS = require('../../config/colors/extendedColors.json');

const COLORS = Object.assign({}, SIMPLE_COLORS, EXTENDED_COLORS);

function getRandomInt(min, max) {
  const roundedMin = Math.ceil(min);
  const roundedMax = Math.floor(max);
  return Math.floor(Math.random() * (roundedMax - roundedMin)) + roundedMin;
}


function unknown() {
  const tirage = getRandomInt(0, 2);
  switch (tirage) {
    case 0: return "Je n'ai pas compris ce que vous avez dit.";
    case 1: return 'Pouvez vous répéter ?';
    default: return "Je n'ai pas compris ce que vous avez dit.";
  }
}


function smartSwitcher(intent, entities) {
  // console.log(entities);
  // message
  if (entities.message != null) {
    fetch(`http://192.168.86.53:5005/say/${entities.message.value}/fr-fr`).then(
      (data) => { console.log(`data recieved : ${data}`); }
    );
    console.log('message');
    return '';
  } else if (entities.object != null) {
    console.log(`entities.object not null, entities.object : ${entities.object}`);
    // objects are lamp, speakers, sensor ...
    let nbObject = entities.object.length;
    let objArray;
    if (nbObject == null) {
      nbObject = 1;
      objArray = [entities.object];
    } else {
      objArray = entities.object;
    }

    console.log(`nbObject : ${nbObject}`);
    for (let i = 0; i < nbObject; i++) {
      switch (objArray[i].value) {
        case 'lampe' :
          entities.on ? lamp2.turnOn() : lamp2.turnOff();
          break;
      }
    }
    return entities.on ? "Je viens d'allumer la lampe" : "Je viens d'éteindre la lampe";
  } else if (entities.salutation != null) {
    return 'Bonjour, comment-allez vous ?';
  } else if (entities.couleur != null && COLORS.hasOwnProperty(entities.couleur[0].value)) {
    scenario.setLampColor(entities.couleur[0].value);

    return "J'espère que cette nouvelle ambiance vous conviendra.";
  }

  return unknown();
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = smartSwitcher;
