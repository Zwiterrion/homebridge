/* eslint react/no-multi-comp: 0, react/jsx-max-props-per-line: 0 */
import PropTypes from 'prop-types';
import React from 'react';
import config from '../config.json';
const querystring = require('querystring');

const faceStyle = {
	maxHeight:"100%",
	maxWidth:"100%",
}

const eyesStyle = {
	width:"400px"
	// maxHeight:"100%",
	// maxWidth:"100%",
}

const buttonStyle = {
	paddingTop:"3%",
	// maxHeight:"100%",
	// maxWidth:"100%",
	width:"80px"
}

const mouthStyle = {
	paddingTop:"5%",
	// maxHeight:"100%",
	// maxWidth:"100%",
	width:"150px"
}

class Face extends React.Component {

	handleMouseOver = () => this.setState({hover : true})

  handleMouseOut = () => this.setState({hover : false})

	constructor(props){
		super(props);
		this.state = {
			hover : false
		}
	}

	propTypes: {
		record : PropTypes.bool,
		onMicClick : PropTypes.func,
  }

  componentDidMount(){}

  componentWillUnmount(){}

  selectImg(){
    if(this.props.record){
      if(this.state.hover){
        return require(`../img/micOffHover.png`)
      }
      else{
        return require(`../img/micOff.png`)
      }
    }
    else{
      if(this.state.hover){
        return require(`../img/micOnHover.png`)
      }
      else{
        return require(`../img/micOn.png`)
      }
    }
  }

  render() {
      return (
				<div style={faceStyle}>
	        <div className="grid--middle grid--center">
	          <img
								className="3/3 grid__cell"
	              src={require(`../img/eyes.png`)}
								style={eyesStyle}
	          />
					</div>
					<div className="grid--middle grid--center">
	          <img
	              className = "1/3 grid__cell"
	              src={this.selectImg()}
	              onMouseOver={this.handleMouseOver}
	              onMouseOut={this.handleMouseOut}
	              onClick={this.props.onMicClick}
	              style={buttonStyle}
	          />
					</div>
					<div className="grid--middle grid--center">
	          <img
	              className = "1/3 grid__cell"
	              src={require(`../img/mouth.png`)}
	              style={mouthStyle}
	          />
					</div>
				</div>
      );
    }
}

export default Face;
