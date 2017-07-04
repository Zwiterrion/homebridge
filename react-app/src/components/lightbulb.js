/* eslint react/no-multi-comp: 0, react/jsx-max-props-per-line: 0 */
import React, { PropTypes } from 'react';

const Styles = {
  Card: {
    boxSizing: 'border-box',
    boxShadow: '10px 10px 6px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.12)',
    maxWidth: 250,
    minWidth: 250,
    marginRight: 'auto',
    marginLeft: 'auto'
  },
  Title: {
    fontWeight: 'bold',
    padding: 8,
    color: 'white',
    background: 'rgb(57,101,178)',
    marginRight: 'auto',
    marginLeft: 'auto'
  },
  Info: {
    marginTop: 16,
    marginBottom: 16,
    marginRight: 'auto',
    marginLeft: 'auto',
    float: 'center'
  },
  Liked: {
    cursor: 'pointer',
    color: 'black',
    marginRight: 8,
    padding: 4,
    background: 'yellow',
    borderRadius: '4px'
  },
  Image: {
    padding: 8,
    float: 'Center'
  }
};

export const LightBulb = React.createClass({
  propTypes: {
    name: PropTypes.string.isRequired
  },

  getInitialState() {
    return {
      brightness: 0,
      on: false,
      asc: true
    };
  },

  handleToggleLike() {
    let brightness = this.state.brightness;
    let asc = this.state.asc;
    if(asc){
      if(brightness<100){
        this.setState({brightness : brightness+10, on: true});
      }
      else{
        this.setState({brightness : brightness-10, asc: false });
      }
    }
    else{
      if(brightness>10){
        this.setState({brightness : brightness-10 });
      }
      else if(brightness==10){
        this.setState({brightness : brightness-10, on : false});
      }
      else{
        this.setState({brightness : brightness+10, on : true, asc: true });
      }
    }
  },

  render() {
    return (
      <div style={Styles.Card}>
          <h2 style={Styles.Title}> {this.props.name} </h2>
          <img style={Styles.Image}
              src={this.state.on ? require(`../img/light-bulb-${this.state.brightness}.png`): require('../img/light-bulb-0.png')}
              width="250"
          />
      </div>
    )
  }
});

export default LightBulb
