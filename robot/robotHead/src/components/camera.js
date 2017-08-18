import React from 'react';
import Webcam from 'react-webcam';
import {convertToDataURIToBinary} from '../utils/canvasUtils.js';

const INTERVAL = 5000;
const URL = `http://localhost:8090/detect`;

const API_KEY = 'eb8bc9e352f6421f9dc3b3ea30ad736c';
const API_ROOT_URL = 'https://api.projectoxford.ai/face/v1.0';
const GROUP_ID = 'linka-digitech';

export const Camera = React.createClass({

	getInitialState() {
    return {
			client : {
				name : "",
			},
    };
  },

	setRef(webcam){
		this.webcam = webcam;
	},

	capture(){
		const imageSrc = convertToDataURIToBinary(this.webcam.getScreenshot());
<<<<<<< HEAD
		console.log(imageSrc);
		fetch(URL, {
			method: 'POST',
			headers: {
				'Accept': 'application/octet-stream',
				'Content-Type': 'application/octet-stream'
			},
			body: imageSrc
		})
	// 	let headers = {'Content-Type': 'application/octet-stream','Ocp-Apim-Subscription-Key': API_KEY};
  //   let url = API_ROOT_URL+'/detect?returnFaceId=true&returnFaceLandmarks=false';
	// 	return fetch(`${url}`, {
	// 		method : 'POST',
	// 		headers : headers,
	// 		body : imageSrc
	// 	})
	// 	.then( results => {
	// 		return results.json()
	// 	})
	// 	.then(results => {
	// 		console.log(results.toSource());
	// 		results.map( face => {
	// 			console.log(face)
	// 			let faceIds = face.faceId;
	// 			if(faceIds.length > 0) {
	// 				// return faceIds;
	// 				console.log(faceIds)
	// 			}
	// 			console.log("face id vide")
	// 		}
	// )})
=======
		// console.log(imageSrc);
		// fetch(URL, {
		// 	method: 'POST',
		// 	headers: {
		// 		'Accept': 'application/octet-stream',
		// 		'Content-Type': 'application/octet-stream'
		// 	},
		// 	body: imageSrc
		// })
		let headers = {'Content-Type': 'application/octet-stream','Ocp-Apim-Subscription-Key': API_KEY};
    let url = API_ROOT_URL+'/detect?returnFaceId=true&returnFaceLandmarks=false';
		return fetch(`${url}`, {
			method : 'POST',
			headers : headers,
			body : imageSrc
		})
		.then( results => {
			return results.json()
		})
		.then(results => {
			console.log(results.toSource());
			results.map( face => {
				console.log(face)
				let faceIds = face.faceId;
				if(faceIds.length > 0) {
					// return faceIds;
					console.log(faceIds)
				}
				else
				console.log("face id vide")
			}
	)})
>>>>>>> 07dac51c30c7e3b7e19c9edda148ead30a071547
	},

	componentDidMount(){
		// setInterval(()=>{ this.capture() }, INTERVAL);
  },

  componentWillUnmount(){
  },


	recognize() {
    const dataURI = this.extractImageFromWebCam();
    this.displayOptions.loading = true;
  },

	render() {
		return (
			<div className = "webcam">
					<Webcam
						audio={false}
          	height={300}
          	ref={this.setRef}
          	screenshotFormat="image/jpeg"
          	width={300}
					/>
					<button onClick={this.capture}>Capture photo</button>
			</div>
		)
	}

})

export default Camera;
