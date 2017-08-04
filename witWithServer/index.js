
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
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);

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
      console.log("json : " + JSON.stringify(json));
      console.log("json.entitites.object : " + json.entities.object);
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
    return "Bonjour ! Tu va bien ?"
    // const params = {
    //   key: 'b29c66ace5c74a4d8150cd95b6819725',
    //   hl: 'fr-fr',
    //   src: 'Bonjour Florian ! Tu va bien ?',
    //   r: 0,
    //   c: 'mp3',
    //   f: '44khz_16bit_stereo',
    //   ssml: false,
    //   b64: false,
    // };
    // const uri = "http://api.voicerss.org/";
    // console.log("Salutation");
    //
    // fetch(uri + "?" + querystring.stringify(params), {
    //   method: 'GET',
    // }).then((content) => {
    //   console.log(content.url);
    //   return content.url;
    // })
  }
}

app.listen(PORT, ()=>(console.log(`listening on port : ${PORT}`)));
