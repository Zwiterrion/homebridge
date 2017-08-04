/* eslint react/no-multi-comp: 0, react/jsx-max-props-per-line: 0 */
import React from 'react';
import {ReactMic} from 'react-mic';
import Sound from 'react-sound';
const querystring = require('querystring');

export const Mic = React.createClass({
  propTypes: {
  },

  getInitialState() {
    return {
      record: false,
      hover : false,
      mp3 : "",
      sound : false
    };
  },

  componentDidMount(){
  },

  componentWillUnmount(){
  },

  record(){
    this.setState({
      record: !this.state.record
    });
  },

  blobToBase64(blob, callback) {
    var reader = new FileReader();
    reader.onload = function() {
      var dataUrl = reader.result;
      var base64 = dataUrl.split(',')[1];
      callback(base64);
    };
    reader.readAsDataURL(blob); // readAsDataUrl encode in base
  },

  handleStop(recordedBlob){
    let that = this;
    this.blobToBase64(recordedBlob.blob, function(base64){
      var update = {blob: base64};
      update = JSON.stringify(update);
      fetch('http://localhost:8080/record/', {
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
          console.log(text);
          const params = {
            key: 'b29c66ace5c74a4d8150cd95b6819725',
            hl: 'fr-fr',
            src: text,
            r: 0,
            c: 'mp3',
            f: '44khz_16bit_stereo',
            ssml: false,
            b64: false
          };
          const uri = "http://api.voicerss.org/";

          fetch(uri + "?" + querystring.stringify(params), {
            method: 'GET'
          }).then((content) => {
            const text = content.url
            // const text = content.url + "";
            console.log(text);
            that.setState({
              mp3: text,
              sound: true
            });
            // console.log(this.state);
          });
        })
      })
    })
  },

  handleMouseOver(){
    this.setState({hover : true});
  },

  handleMouseOut(){
    this.setState({hover : false});
  },

  selectImg(){
    if(this.state.record){
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
  },

  setSound(){
    this.setState({sound:false});
  },

  render() {
    if(this.state.sound){
      return (
        <div>
          <ReactMic
              record={this.state.record}
              className="sound-wave"
              onStop={this.handleStop}
              strokeColor="#ffffff"
              backgroundColor="#008fca"
              width="400"
          />
          <br/>
          <br/>
          <div className = "micbutton">
            <img
                src={this.selectImg()}
                onMouseOver={this.handleMouseOver}
                onMouseOut={this.handleMouseOut}
                onClick={this.record}
                width="100"
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
        <div>
          <ReactMic
              record={this.state.record}
              className="sound-wave"
              onStop={this.handleStop}
              strokeColor="#ffffff"
              backgroundColor="#008fca"
              width="400"
          />
          <br/>
          <br/>
          <div className = "micbutton">
            <img
                src={this.selectImg()}
                onMouseOver={this.handleMouseOver}
                onMouseOut={this.handleMouseOut}
                onClick={this.record}
                width="100"
            />
          </div>
        </div>
      );
    }
  }
});

export default Mic;
