const audioProcessing = require('../api/wit/witRequest.js');
const dispatcher = require('../dispatcher/dispatcher');

function processAudio(req, res){
	audioProcessing(req)
	.then( json => {
		return dispatcher(json.intent, json.entities);
	})
	.then( result=>res.json(result) )
}

module.exports = processAudio;
