import React from 'react';
import Webcam from 'react-webcam';
import {convertToDataURIToBinary} from '../utils/canvasUtils.js';
import config from '../config.json';

const INTERVAL = 1500;
const NOBODY = "Aucun visage reconnu";

const titleStyle = {
	marginTop: "20px"
}

// const camDivStyle ={
// 	marginTop : "50px",
// 	borderStyle : "solid",
// 	borderWidth : "5px",
// 	borderColor : "rgb(2, 110, 210)",
// 	borderRadius: "50px",
// 	background: "rgb(255, 255, 255)"
// };

// const buttonStyle = {
// 	display:"block", /* change this from inline-block */
// 	margin:"0 auto" /* this will center  it */
// }

class Camera extends React.Component {

	constructor(props){
		super(props);
		this.updateDimensions = this.updateDimensions.bind(this);
		this.setRef = this.setRef.bind(this);
		this.capture = this.capture.bind(this);
		this.state = {
			width : 500,
			person : [],
			names : NOBODY
		};
	}

	componentWillMount() {
		// this.updateDimensions();
	}

	componentDidMount(){
		// window.addEventListener("resize", this.updateDimensions);
		setInterval( () => { this.capture() }, INTERVAL);
	}
	
	componentWillUnmount(){
		// window.removeEventListener("resize", this.updateDimensions);
	}
	
	updateDimensions() {
		const MIN_LIMIT = 300; 
		const MAX_LIMIT = 640; 
		let width = window.innerWidth*0.45;
		if (width < MIN_LIMIT) width = MIN_LIMIT;
		else if (width > MAX_LIMIT) width = MAX_LIMIT;
		this.setState({ width: width });
	}

	setRef(webcam){
		this.webcam = webcam
	}

	capture(){		
		let screenshot = this.webcam.getScreenshot();
		if(screenshot){
			let that = this;
			const imageSrc = convertToDataURIToBinary(screenshot);
			fetch(`${config.server}detect/`, {
				method: 'POST',
				headers: {
					'Accept': 'application/octet-stream',
					'Content-Type': 'application/octet-stream'
				},
				body: imageSrc
			})
			.then(response => {
				response.json().then(people =>{
					if(people){
						if(people[0]){
							let names = people[0].name;
							let person = [people[0]];
							for (let i = 1; i < people.length; i++){
								names = names + " et " + people[i].name;
								person[i] = people[i];
							}
							that.setState({ names : names, person : person })
						}
						else that.setState({ names : NOBODY, person : [] });
						console.log(this.state.person.toSource());
					}
				})
			})
		}
	}

	render() {
		return (
			<div className = "webcam">
				<div className="row justify-content-center">					
					<h2 style={titleStyle}>{this.state.names}</h2>					
				</div>

				<div className="row justify-content-center">					
						<Webcam
							audio={false}
							ref={this.setRef}
							screenshotFormat="image/jpeg"
							width={this.state.width}
						/>										
				</div>
			</div>
		)
	}

}

export default Camera;
