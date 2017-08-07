const fetch = require('node-fetch')

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
	}).then(result => {console.log(result); return result} )
}

module.exports = sendAudioRequest;
