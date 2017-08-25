import React from 'react';
import {ReactMic} from 'react-mic';
import Sound from 'react-sound';
import config from '../config.json';
import Face from './face';
const querystring = require('querystring');

const divMicStyle = {
	//margin : "10px",
}

class Mic extends React.Component{
  
	constructor(props){
		super(props);
		this.state = {
			record: false,
      mp3 : "",
      sound : false
    }
    this.record = this.record.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.setSound = this.setSound.bind(this);
	}

  componentDidMount(){}

  componentWillUnmount(){}

	record(){
    this.setState({record: !this.state.record})
  }

  blobToBase64(blob, callback) {
    var reader = new FileReader();
    reader.onload = function() {
      var dataUrl = reader.result;
      var base64 = dataUrl.split(',')[1];
      callback(base64);
    };
    reader.readAsDataURL(blob); // readAsDataUrl encode in base
  }

  handleStop(recordedBlob){
    let that = this;
    this.blobToBase64(recordedBlob.blob, function(base64){
      var update = {blob: base64};
      update = JSON.stringify(update);
      fetch(config.server + 'record/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: update
      })
      .then((response)=>{
        response.json().then((text)=>
        {
          const params = {
            key: config.voicerss.key,
            hl: config.voicerss.language,
            src: text,
            r: 0,
            c: 'mp3',
            f: '44khz_16bit_stereo',
            ssml: false,
            b64: false
          };

          fetch(config.voicerss.uri + "?" + querystring.stringify(params), {
            method: 'GET'
          }).then((content) => {
            that.setState({
              mp3: content.url,
              sound: true
            });
          });
        })
      })
    })
  }

	setSound(){
    this.setState({sound:false})
  }

  render() {
		if (this.state.sound){
      return (
        <div style={divMicStyle}>
          <Face
						record={this.state.record}
						onMicClick={this.record}
          />
          <div className = "recordDisplay">
            <ReactMic
              record={this.state.record}
              className="sound-wave"
              onStop={this.handleStop}
              strokeColor="#ffffff"
              backgroundColor="#008fca"
              width="400"
            />
          </div>
          <Sound
              url={this.state.mp3}
              playStatus={Sound.status.PLAYING}
              onFinishedPlaying={this.setSound}
          />
        </div>
      );
    }
    else{
      return (
        <div style={divMicStyle}>
					<Face
						record={this.state.record}
						onMicClick={this.record}
					/>
					<div className = "recordDisplay">
            <ReactMic
              record={this.state.record}
              className="sound-wave"
              onStop={this.handleStop}
              strokeColor="#ffffff"
              backgroundColor="#008fca"
              width="400"
            />
					</div>
        </div>
      );
    }
  }
}

export default Mic;
