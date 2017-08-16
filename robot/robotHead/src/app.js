/* eslint react/jsx-max-props-per-line: 0 */

import 'whatwg-fetch';
import React from 'react';
import Mic from './components/mic';
import Camera from './components/camera';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

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
			<Router>
	      <div className="outer">
	        <div className="middle">
	          <div className="inner">
							<ul>
								<li><Link to="/"> Mic </Link></li>
								<li><Link to="/camera"> Camera </Link></li>
							</ul>

							<Route exact path="/" component={Mic}/>
							<Route path="/camera" component={Camera}/>
	              {/* <Mic /> */}
	          </div>
	        </div>
	      </div>
			</Router>
    );
  }
});
