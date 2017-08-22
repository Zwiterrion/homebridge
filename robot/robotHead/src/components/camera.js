import React from 'react';
import Webcam from 'react-webcam';
import {convertToDataURIToBinary} from '../utils/canvasUtils.js';

const INTERVAL = 5000;
const URL = `http://localhost:8090/detect`;

const API_KEY = 'eb8bc9e352f6421f9dc3b3ea30ad736c';
const API_ROOT_URL = 'https://api.projectoxford.ai/face/v1.0';
const GROUP_ID = 'linka-digitech';

const camDivStyle ={
	marginTop : "50px",
	borderStyle : "solid",
	borderWidth : "5px",
	borderColor : "rgb(2, 110, 210)",
	borderRadius: "50px",
	background: "rgb(255, 255, 255)",
};

const buttonStyle = {
	display:"block", /* change this from inline-block */
  margin:"0 auto", /* this will center  it */
}

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
		console.log(imageSrc);
		fetch(URL, {
			method: 'POST',
			headers: {
				'Accept': 'application/octet-stream',
				'Content-Type': 'application/octet-stream'
			},
			body: imageSrc
		})

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
			<div
				className = "webcam"
				style = {camDivStyle}
			>
					<Webcam
						audio={false}
          	height={300}
          	ref={this.setRef}
          	screenshotFormat="image/jpeg"
          	width={300}
					/>
					<button
						onClick={this.capture}
						style = {buttonStyle}
					>
						Capture photo
					</button>
			</div>
		)
	}

})

export default Camera;
