const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const processAudio = require('./expressFunctions/userAudioInputProcessing');
const processVideo = require('./expressFunctions/userVideoInputProcessing');
const lampSwitch = require('./expressFunctions/domoEvents');
const fs = require('fs');


// getting the mood and loading the events
const config = require('../config/config.json');
require(`./mood/${config.mood}.js`)()

// process.argv.forEach(function (val, index, array) {
//   console.log(index + ': ' + val);
// });


// to be removed
const PORT = 8090;

// express part

const rawOptions = {
  extended: false,
  type: 'application/octet-stream'
};

const urlencodedOptions = {
  extended: true,
};

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded(urlencodedOptions) );
app.use( bodyParser.raw(rawOptions) );

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});




// routes
app.post('/record', processAudio);
app.post('/detect', processVideo);
app.post('/light/state', lampSwitch); 
app.listen(PORT, ()=>{
  console.log(`listening on port : ${PORT}`);
  initImg("img/");
});

function initImg(imgPath){
  fs.createReadStream(`${imgPath}source.jpg`).pipe(fs.createWriteStream(`${imgPath}test0.jpg`));
}

