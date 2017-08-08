const fetch = require('node-fetch')

// config
const SIMPLE_COLORS = require('../../config/colors/simpleColors.json');
const EXTENDED_COLORS = require('../../config/colors/extendedColors.json');
const COLORS = Object.assign({},SIMPLE_COLORS,EXTENDED_COLORS);
console.log(COLORS);

// object and APIs
const OHLamp = require('../domo/openHab/lamp');
const OHSpeakers = require('../domo/openHab/speakers');

const OPENHAB_URL = 'http://192.168.86.55:8080';

let lamp2 = new OHLamp(
	`${OPENHAB_URL}/rest`,
	'hue_0210_0017886830d3_2'
);

let play1 = new OHSpeakers(
	`${OPENHAB_URL}/rest`,
	'sonos_PLAY1_RINCON_949F3E8C3E8001400'
);

function smartSwitcher(intent, entities){
  console.log(entities);
  // message
  if (entities.message != null){
    fetch(`http://192.168.86.53:5005/say/${entities.message.value}/fr-fr`).then(
      (data)=> { console.log("data recieved : " + data)}
    );
    console.log("message");
		return ""; 
  }
  // object
  else if (entities.object != null){
    console.log("entities.object not null, entities.object :" + entities.object);
    // objects are lamp, speakers, sensor ...
    let nbObject = entities.object.length;
    let objArray;
    if (nbObject == null){
      nbObject = 1;
      objArray = [entities.object];
    }else{
      objArray = entities.object;
    }

    console.log("nbObject :" +  nbObject);
    for (let i = 0; i < nbObject; i++){
      switch (objArray[i].value){
        case "lampe" :
          entities.on ? lamp2.turnOn() : lamp2.turnOff();
          break;
      }
    }
    return entities.on ? "Je viens d'allumer la lampe":"Je viens d'éteindre la lampe";
  }
  else if (entities.salutation != null){
    return "Bonjour, comment-allez vous ?"
  }
  else if (entities.couleur != null && COLORS.hasOwnProperty(entities.couleur[0].value)){

		lamp2.setColor(COLORS[entities.couleur[0].value]);
    return "J'espère que cette nouvelle ambiance vous conviendra."
  }
  else{
		return unknown();
  }
}

function unknown(){
	const tirage = getRandomInt(0,2);
	switch(tirage){
		case 0 : return "Je n'ai pas compris ce que vous avez dit."
		case 1 : return "Pouvez vous répéter ?"
		default : return "Je n'ai pas compris ce que vous avez dit."
	}
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = smartSwitcher;
