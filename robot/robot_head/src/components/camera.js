import React from 'react';
import Webcam from 'react-webcam';
import {convertToDataURIToBinary} from '../utils/canvasUtils.js';
import config from '../config.json';

const INTERVAL = 1500;
const NOBODY = "Aucun visage reconnu";

const titleStyle = {
	marginTop: "20px"
}

class Camera extends React.Component {

	constructor(props){
		super(props);		
		this.setRef = this.setRef.bind(this);
		this.capture = this.capture.bind(this);
		this.state = {
			width : 500,
			person : [],
			names : NOBODY
		};
	}

	componentWillMount() {}

	componentDidMount(){		
		setInterval( () => { this.capture() }, INTERVAL);
	}
	
	componentWillUnmount(){}

	setRef(webcam){
		this.webcam = webcam
	}

	capture(){		
		let screenshot = this.webcam.getScreenshot();
		if(screenshot){
			//console.log('screenshot: ' + screenshot);
			let that = this;
			const imageSrc = convertToDataURIToBinary(screenshot);
			//console.log(screenshot);
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
