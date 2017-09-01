const express = require('express');
const bodyParser = require('body-parser');
const processAudio = require('./expressFunctions/userAudioInputProcessing');
const processVideo = require('./expressFunctions/userVideoInputProcessing');
const sse = require('./expressFunctions/sse');
const lampSwitch = require('./expressFunctions/domoEvents');
const fs = require('fs');
const logger = require('./utils/logger');
const config = require('../config/config.json');

const app = express();

// =====================
// mood selection
// =====================

let selectedMood;

// if it specified as a cmd arguments, choose it
if (process.argv[2]) {
  const acceptedMoods = ['conf', 'serli', 'welcome'];
  if (acceptedMoods.includes(process.argv[2])) {
    selectedMood = process.argv[2];
  } else {
    logger.warn('Invalid mood specified as cmd line argument, taking default mood from config.json');
  }
}
// else we take the default one from the config file 
if (!selectedMood) {
  selectedMood = config.mood;
}

// loading events with the selected mood
require(`./mood/${selectedMood}.js`)();

// =====================
// other initialization
// =====================

function initImg(imgPath) {
  fs.createReadStream(`${imgPath}source.jpg`).pipe(fs.createWriteStream(`${imgPath}test0.jpg`));
}

sse.sseEventListen();

// =====================
// express part
// =====================

// to be removed
const PORT = 8090;

const rawOptions = {
  extended: false,
  type: 'application/octet-stream',
};

const urlencodedOptions = {
  extended: true,
};

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded(urlencodedOptions));
app.use(bodyParser.raw(rawOptions));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// routes
app.post('/record', processAudio);
app.post('/detect', processVideo);
app.post('/light/state', lampSwitch);
app.get('/sse', (req, res) => {
  sse.subscribe(req, res);
});
app.listen(PORT, () => {
  console.log(`listening on port : ${PORT}, with mood '${selectedMood}'`);
  initImg('img/');
});
