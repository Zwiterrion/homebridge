const audioProcessing = require('../api/wit/witRequest.js');
const faceApi = require('../api/faceRecognition/FaceApi.js');

function processVideo(req, res){
	audioProcessing(req)
	.then( json => {
		return faceApi.detectFace(json.intent, json.entities);
	})
	.then( result=>res.json(result) )
}

module.exports = processVideo;
