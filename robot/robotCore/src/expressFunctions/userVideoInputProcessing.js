const audioProcessing = require('../api/wit/witRequest.js');
const FaceApi = require('../api/faceRecognition/FaceApi.js');
const util = require('util')

function processVideo(req, res){
	// req.setEncoding('utf16');
	//console.log("req: " + util.inspect(req));
	const faceApi = new FaceApi();
	return faceApi.detectFace(req.body)
	.then( result => { console.log(result);return result } )
}

module.exports = processVideo;
