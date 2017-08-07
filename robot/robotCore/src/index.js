const fetch = require('node-fetch');
const express = require('express')
const app = express()
const fs = require('fs')
const { exec } = require('child_process');
const bodyParser = require('body-parser');
const querystring = require('querystring');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

const OHLamp = require('./domo/openHab/lamp');
const OHSpeakers = require('./domo/openHab/speakers');
const wit = require('./api/wit/witRequest');

const OPENHAB_URL = 'http://192.168.86.55:8080';

let lamp2 = new OHLamp(
	`${OPENHAB_URL}/rest`,
	'hue_0210_0017886830d3_2'
);

let play1 = new OHSpeakers(
	`${OPENHAB_URL}/rest`,
	'sonos_PLAY1_RINCON_949F3E8C3E8001400'
);

const PORT=8090;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/record', function(req, res){
  var buf = new Buffer(req.body.blob, 'base64'); // decode

  fs.writeFileSync("audio/test.ogg", buf)
  exec( 'opusdec --force-wav audio/test.ogg - | sox - audio/test.wav', (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      console.log('error executing command');
      console.log(`stderr: ${stderr}`);
      return;
    }

    // the *entire* stdout and stderr (buffered)
    // console.log(`stdout: ${stdout}`);
    // console.log(`stderr: ${stderr}`);

    var data = fs.readFileSync(`./audio/test.wav`);
    wit(data)
    .then(function(res2) {
      return res2.json();
    })
    .then(function(json){
      // console.log("json : " + JSON.stringify(json));
      // console.log("json.entitites.object : " + json.entities.object);
      return smartSwitcher(json.intent, json.entities);
    })
    .then(result=>res.json(result))
  })
});


app.get('/audio/:name', function(req, res){
  try{
    var data = fs.readFileSync(`./audio/${req.params.name}`);
		wit(data)
		.then(function(res2) {
      return res2.json();
    }).then(function(json){
      // console.log("json : " + JSON.stringify(json));
      // console.log("json.entitites.object : " + json.entities.object);
      res.send(smartSwitcher(json.intent, json.entities));
    });
  }catch(e){
    console.log('Error:', e.stack);
  }
});

function smartSwitcher(intent, entities){
  console.log(entities);
  // message
  if (entities.message != null){
    fetch(`http://192.168.86.53:5005/say/${entities.message.value}/fr-fr`).then(
      (data)=> { console.log("data recieved : " + data) }
    );
    console.log("message");
    return ""
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
  else if (entities.couleur != null){
		switch (entities.couleur[0].value){
			case "bleu" 	 : lamp2.setColor(210,100,50); break;
			case "blanc" 	 : lamp2.setColor(0,0,100); break;
			case "beige" 	 : lamp2.setColor(38,40,64); break;
			case "jaune" 	 : lamp2.setColor(56,90,99); break;
			case "magenta" : lamp2.setColor(358,100,43); break;
			case "orange"  : lamp2.setColor(30,100,50); break;
			case "rose" 	 : lamp2.setColor(339,97,71); break;
			case "rouge" 	 : lamp2.setColor(6,94,51); break;
			case "vert" 	 : lamp2.setColor(135,100,50); break;
			case "violet"  : lamp2.setColor(270,100,50); break;
			default				 : return unknown();
		}
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

app.listen(PORT, ()=>(console.log(`listening on port : ${PORT}`)));
