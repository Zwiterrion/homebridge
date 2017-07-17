/* eslint react/jsx-max-props-per-line: 0 */

import 'whatwg-fetch';
import React from 'react';
import AccessoryApp from './components/accessory-app';
import PlatformApp from './components/platform-app';

const titleStyle ={
  margin:0,
  fontWeight: 'bold',
  padding: 8,
  color: 'white',
  background: 'rgb(0,120,150)'
}

export const App = React.createClass({
  render() {
    return (
      <div>
        <h1 style={titleStyle}>Homebridge accessories</h1>
        <AccessoryApp />
      </div>
      /*<div className="grid">
          <div className="1/2 grid__cell">
            <h1 style={titleStyle}>Homebridge accessories</h1>
            <AccessoryApp />
          </div>
          <div className="1/2 grid__cell">
            <h1 style={titleStyle}>Homebridge platforms</h1>
            <PlatformApp />
          </div>
      </div>*/
    );
  }
});
