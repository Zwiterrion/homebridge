import 'whatwg-fetch';
import React, { Component } from 'react';
import Camera from './components/camera';
import Mic from './components/mic';
// import {
//   BrowserRouter as Router,
//   Route,
//   Link
// } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div className="grid--middle grid--center">
        <div className="1/2 grid__cell">
          <Mic />
        </div>
        <div className="1/2 grid__cell">
          <Camera className="camera" />
        </div>
      </div>
    );
  }
}

export default App;
