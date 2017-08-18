const audioProcessing = require('../api/wit/witRequest.js');
const FaceApi = require('../api/faceRecognition/FaceApi.js');
const util = require('util')

function processVideo(req, res){
	// req.setEncoding('utf16');
	console.log("req: " + util.inspect(req.body));
	const faceApi = new FaceApi();
	faceApi.detectFace(req.body)
	.then( result => console.log(result) )
}

module.exports = processVideo;
