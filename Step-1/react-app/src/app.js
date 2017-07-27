/* eslint react/jsx-max-props-per-line: 0 */

import 'whatwg-fetch';
import React from 'react';
import AccessoryApp from './components/accessory-app';

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
    );
  }
});
