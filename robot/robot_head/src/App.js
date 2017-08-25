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
      <div className="container">
        <div className="row align-items-center justify-content-center">
          <div className="col">
            <Mic />
          </div>
          <div className="col">
            <Camera className="camera" />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
