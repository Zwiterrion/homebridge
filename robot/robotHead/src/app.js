/* eslint react/jsx-max-props-per-line: 0 */

import 'whatwg-fetch';
import React from 'react';
import Camera from './components/camera';
import Mic from './components/mic';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

export const App = React.createClass({
  render() {
    return (
			<div className="grid--middle grid--center">
				<div className="1/2 grid__cell">
					<Mic />
				</div>
				<div className="1/2 grid__cell">
					<Camera />
				</div>
			</div>
    );
  }
});
