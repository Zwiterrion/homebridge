/* eslint react/no-multi-comp: 0, react/jsx-max-props-per-line: 0 */
import React, { PropTypes } from 'react';
import { ReactMic } from 'react-mic';

export const Mic = React.createClass({
  propTypes: {
  },

  getInitialState() {
    return {
      record: false,
      hover : false
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

  render() {
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
});

export default Mic;
