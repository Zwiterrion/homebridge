
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


//app.use(express.static('./'));
const TOKEN = 'M6TTF3QQLPHJ7VSCSMDCFRSK2H4NNHEJ';
const API_ENDPOINT = 'https://api.wit.ai/speech';
const PORT=8080;

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
    fetch(API_ENDPOINT, {
      method: 'POST',
      body : data,
      headers: {
        'authorization' : 'Bearer ' + TOKEN,
        'Content-Type' : 'audio/wav'
      }
    })
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
    fetch(API_ENDPOINT, {
      method: 'POST',
      body : data,
      headers: {
        'authorization' : 'Bearer ' + TOKEN,
        'Content-Type' : 'audio/wav'
      }
    }).then(function(res2) {
      return res2.json();
    }).then(function(json){
      console.log("json : " + JSON.stringify(json));
      console.log("json.entitites.object : " + json.entities.object);
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
          console.log("entities.on_off.value :" + entities.on_off[0].value);
          let body = {'on' : (entities.on_off[0].value)=="on" };
          console.log(body);

          fetch('http://192.168.86.41/api/mOFeoGPD5DJlOlU8viJNN0ePuzzN0jQm79anuFDU/lights/2/state', {
            method: 'PUT',
            body : JSON.stringify(body),
            headers: {
              'authorization' : 'Bearer ' + TOKEN,
              'Content-Type' : 'application/json'
            }
          }).then(function(res2) {
            return res2.json();
          }).then(function(json){
            console.log(json);
          });

          break;
      }
    }
    return (entities.on_off[0].value)=="on"? "Je viens d'allumer la lampe":"Je viens d'éteindre la lampe";
  }
  else if (entities.salutation != null){
    return "Bonjour, comment-allez vous ?"
  }
  else if (entities.couleur != null){
    return "J'espère que cette nouvelle ambiance vous conviendra."
  }
  else{
    const tirage = getRandomInt(0,2);
    switch(tirage){
      case 0 : return "Je n'ai pas compris ce que vous avez dit."
      case 1 : return "Pouvez vous répéter ?"
      default : return "Je n'ai pas compris ce que vous avez dit."
    }
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

app.listen(PORT, ()=>(console.log(`listening on port : ${PORT}`)));
