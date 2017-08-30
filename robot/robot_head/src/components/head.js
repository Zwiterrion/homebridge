import React from 'react';
import {ReactMic} from 'react-mic';
import Sound from 'react-sound';
import config from '../config.json';
import Face from './face';


class Head extends React.Component{
  
	constructor(props){
		super(props);
		this.state = {
			record: false,
      mp3 : "",
      sound : false
    }
    this.record = this.record.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.disableSound = this.disableSound.bind(this);
  }
  
  
  
  componentDidMount(){
    let that = this;
    this.source = new EventSource(config.server + "sse");
    this.source.addEventListener(`sse_voice`, function (e) {
      // TODO call nice code to make the browser speak
      console.log(`sse : ${e.data}`);
      // fetch(config.voicerss.uri + "?" + querystring.stringify(that.getVoicerParam(e.data)), {
      //   method: 'GET'
      // }).then((content) => {
        that.setState({
          mp3: e.data,
          sound: true
        });
      //});
    })
  }
  
  componentWillUnmount(){
    this.source.removeAllListeners();
    this.source.close();
  }
  
	record(){
    this.setState({record: !this.state.record})
  }
  
  getVoicerParam(src) {
    return {
      key: config.voicerss.key,
      hl: config.voicerss.language,
      src: src,
      r: 0,
      c: 'mp3',
      f: '44khz_16bit_stereo',
      ssml: false,
      b64: false
    }
  }

  getMicDivStyle(){
    if (!this.state.record) {
      return {
        display: "none"
      }
    }
    return {}
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
    })
  }

	disableSound(){
    this.setState({sound:false})
  }

  render() {
      return (
        <div>
          <Face
						record={this.state.record}
						onMicClick={this.record}
          />
          <div
            className="row justify-content-center"
            style={this.getMicDivStyle()}
          >
            <ReactMic
              record={this.state.record}
              className="sound-wave"
              onStop={this.handleStop}
              strokeColor="#ffffff"
              backgroundColor="#008fca"
              width={500}
              height={100}
            />
          </div>
          {
            this.state.sound ? 
              <Sound
                url={this.state.mp3}
                playStatus={Sound.status.PLAYING}
                onFinishedPlaying={this.disableSound}
              /> 
            : null
          }
        </div>
      );
  }
}

export default Head;
