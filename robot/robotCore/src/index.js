const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const processAudio = require('./expressFunctions/userAudioInputProcessing');
const processVideo = require('./expressFunctions/userVideoInputProcessing');

const options = {
	extended: true,
  inflate: true,
  limit: '50mb',
  type: 'application/octet-stream'
};

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded(options));

// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//   extended: true
// }));

// app.use(bodyParser.raw(options))

const PORT=8090;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/record', processAudio);
app.post('/detect', processVideo);

app.listen(PORT, ()=>(console.log(`listening on port : ${PORT}`)));
