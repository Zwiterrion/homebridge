
const fetch = require('node-fetch');
const express = require('express')
const app = express()
const fs = require('fs')

var bodyParser = require('body-parser')
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
  //console.log((req.body));
  console.log((req.body.blob));
  var buf = new Buffer(req.body.blob, 'base64'); // decode
  // console.lo g(buf);
  // fs.writeFile("audio/test.wav", buf, function(err) {
  //   if(err) {
  //     console.log("err", err);
  //   } else {
  //     return res.json({'status': 'success'});
  //   }
  // })
  fs.writeFileSync("audio/test.wav", buf)
  var data = fs.readFileSync(`./audio/test.wav`);
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
    smartSwitcher(json.intent, json.entities);
    res.send("succes");
  });

  // try{
  //   var data = fs.readFileSync(`./audio/test.wav`);
  //   fetch(API_ENDPOINT, {
  //     method: 'POST',
  //     body : data,
  //     headers: {
  //       'authorization' : 'Bearer ' + TOKEN,
  //       'Content-Type' : 'audio/wav'
  //     }
  //   }).then(function(res2) {
  //     return res2.json();
  //   }).then(function(json){
  //     console.log("json : " + JSON.stringify(json));
  //     console.log("json.entitites.object : " + json.entities.object);
  //     smartSwitcher(json.intent, json.entities);
  //     res.send("succes");
  //   });
  // }catch(e){
  //   console.log('Error:', e.stack);
  // }

  // console.log(req.body.blob);
  // fetch(API_ENDPOINT, {
  //   method: 'POST',
  //   body : req.body,
  //   headers: {
  //     'authorization' : 'Bearer ' + TOKEN,
  //     'Content-Type' : 'audio/mpeg3'
  //   }
  // }).then(function(res2) {
  //   return res2.json();
  // }).then(function(json){
  //   console.log("json : " + JSON.stringify(json));
  //   console.log("json.entitites.object : " + json.entities.object);
  //   smartSwitcher(json.intent, json.entities);
  //   res.send("succes");
  // });
  // res.send('BLOB recieve');
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
      smartSwitcher(json.intent, json.entities);
      res.send("succes");
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
  }
}

app.listen(PORT);
