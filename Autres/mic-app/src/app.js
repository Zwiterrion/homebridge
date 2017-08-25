/* eslint react/jsx-max-props-per-line: 0 */

import 'whatwg-fetch';
import React from 'react';
import Mic from './components/mic';

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
      <div className="outer">
        <div className="middle">
          <div className="inner">
              <Mic />
          </div>
        </div>
      </div>
    );
  }
});
