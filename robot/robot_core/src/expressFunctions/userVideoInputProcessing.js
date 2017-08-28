const FaceApi = require('../api/faceRecognition/FaceApi.js');
const fs = require('fs');
const gm = require('gm');

const faceApi = new FaceApi();

function processVideo(req, res){
	let data = req.body;
	var buf = new Buffer(data, 'base64');
	const path0 = "img/test0.jpg";
	const path1 = "img/test1.jpg";
	fs.writeFileSync(path1, buf);

	var options = {
		tolerance: 0.03,
	};
	gm.compare(path0, path1, options, function (err, isEqual, equality, raw) {
		if (err) throw err;
		// console.log("equals");
		// console.log(`raw : ${raw}`)
		if(isEqual){
			res.json(0);
		}
		else{
			faceApi.detectFace(req.body)
			.then( faceIds => {
				console.log(`face id : ${faceIds}`);
				return faceApi.identify(faceIds);
			})
			.then( personId => {
				console.log(`person id : ${personId}`);
				return faceApi.getPersonNames(personId);
			})
			.then (result => {
				console.log(result);
				res.json(result)
			})
		}
		fs.rename(path1, path0, function(err) {
			if ( err ) console.log('ERROR: ' + err);
		});
	})
}

module.exports = processVideo;
