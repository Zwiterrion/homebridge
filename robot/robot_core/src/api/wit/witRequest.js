const fetch = require('node-fetch')
const fs = require('fs');
const exec = require('child-process-promise').exec;

const TOKEN = 'M6TTF3QQLPHJ7VSCSMDCFRSK2H4NNHEJ';
const API_ENDPOINT = 'https://api.wit.ai/speech';


function sendAudioRequest(data){
	return fetch(API_ENDPOINT, {
		method: 'POST',
		body : data,
		headers: {
			'authorization' : 'Bearer ' + TOKEN,
			'Content-Type' : 'audio/wav'
		}
	}).then( result => {console.log(result); return result} )
}


function audioToWit(req, oggFileName){
  var buf = new Buffer(req.body.blob, 'base64'); // decode

  fs.writeFileSync(`audio/${oggFileName}.ogg`, buf)
	// converting the ogg extracted from the browser to a wav file usable by wit
  return exec( `opusdec --force-wav audio/${oggFileName}.ogg - | sox - audio/${oggFileName}.wav`).then(
		(res) => {
			var stdout = res.stdout;
      var stderr = res.stderr;
      console.log('stdout: ', stdout);
      console.log('stderr: ', stderr);
			var data = fs.readFileSync(`./audio/${oggFileName}.wav`);
			return sendAudioRequest(data).then( res2 => { // send the file to wit
				return res2.json();
			});
		}).catch(function (err) {
        console.error('ERROR: ', err);
    });
}

module.exports = audioToWit;