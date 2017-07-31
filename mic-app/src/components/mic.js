/* eslint react/no-multi-comp: 0, react/jsx-max-props-per-line: 0 */
import React, { PropTypes } from 'react';
import { ReactMic } from 'react-mic';

export const Mic = React.createClass({
  propTypes: {
  },

  getInitialState() {
    return {
      record: false
    };
  },

  componentDidMount(){
  },

  componentWillUnmount(){
    this.source.removeAllListeners();
    this.source.close();
  },

  startRecording(){
    this.setState({
      record: true
    });
  },

  stopRecording(){
    this.setState({
      record: false
    });
  },

  blobToBase64(blob, callback) {
    var reader = new FileReader();
    reader.onload = function() {
      var dataUrl = reader.result;
      var base64 = dataUrl.split(',')[1];
      callback(base64);
    };
    reader.readAsDataURL(blob);
  },

  onStop(recordedBlob){
    this.blobToBase64(recordedBlob.blob, function(base64){
      var update = {blob: base64};
      update = JSON.stringify(update);
      fetch('http://192.168.86.55:8080/record/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: update
      })
    })
  },

  render() {
    return (
      <div>
        <ReactMic
            record={this.state.record}
            className="sound-wave"
            onStop={this.onStop}
            strokeColor="#000000"
            backgroundColor="#FF4081" />
        <br/>
        <button onClick={this.startRecording} type="button">Start</button>
        &nbsp;
        <button onClick={this.stopRecording} type="button">Stop</button>
      </div>
    );
  }
});

export default Mic;
