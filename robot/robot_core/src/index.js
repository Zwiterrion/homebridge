const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const processAudio = require('./expressFunctions/userAudioInputProcessing');
const processVideo = require('./expressFunctions/userVideoInputProcessing');
const winston = require('winston');
const util = require('util');
const lampSwitch = require('./expressFunctions/domoEvents');
const { eventEmitter, events } = require('./events.js')


const rawOptions = {
	extended: false,
  type: 'application/octet-stream'
};

const urlencodedOptions = {
	extended: true,
};

const PORT = 8090;

eventEmitter.on(events.domoEvents.lampOn, () => winston.info('A lamp has been switched on'))


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
app.listen(PORT, ()=>(console.log(`listening on port : ${PORT}`)));

