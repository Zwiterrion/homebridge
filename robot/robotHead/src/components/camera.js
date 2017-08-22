import React from 'react';
import Webcam from 'react-webcam';
import {convertToDataURIToBinary} from '../utils/canvasUtils.js';

const URL = `http://localhost:8090/detect`;
const INTERVAL = 1000;

export const Camera = React.createClass({

	getInitialState() {
    return {
			client : {
				name : " "
			}
    };
  },

	componentDidMount(){
		setInterval(()=>{ this.capture() }, INTERVAL);
	},

	componentWillUnmount(){
	},

	setRef(webcam){
		this.webcam = webcam;
	},

	capture(){
		let that = this;
		const imageSrc = convertToDataURIToBinary(this.webcam.getScreenshot());
		fetch(URL, {
			method: 'POST',
			headers: {
				'Accept': 'application/octet-stream',
				'Content-Type': 'application/octet-stream'
			},
			body: imageSrc
		})
		.then(response => {
			response.json().then(names =>{
				if(names){
					if(names[0]){
						let name = names[0].name;
						for(let i = 1; i<names.length; i++){
							name = name + " et " + names[i].name;
						}
						that.setState({name: name})
					}
					else that.setState({name: " "});
				}
			})
		})
	},

	// recognize() {
  //   const dataURI = this.extractImageFromWebCam();
  //   this.displayOptions.loading = true;
  // },

	render() {
		return (
			<div className = "webcam">
				<h2>{this.state.name}</h2>
					<Webcam
						audio={false}
						height={300}
						ref={this.setRef}
						screenshotFormat="image/jpeg"
						width={300}
					/>
					{/* <button onClick={this.capture}>Capture photo</button> */}
			</div>
		)
	}

})

export default Camera;
