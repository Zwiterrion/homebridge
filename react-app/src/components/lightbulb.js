/* eslint react/no-multi-comp: 0, react/jsx-max-props-per-line: 0 */
import React, { PropTypes } from 'react';

const Styles = {
  Card: {
    boxSizing: 'border-box',
    boxShadow: '10px 10px 6px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.12)',
    maxWidth: 410,
    minWidth: 410,
    minHeight: 350,
    marginRight: 'auto',
    marginLeft: 'auto',
    background: 'white',
    borderRadius: 20
  },
  Title: {
    fontWeight: 'bold',
    padding: 8,
    color: 'white',
    background: 'rgb(57,101,178)',
    marginRight: 'auto',
    marginLeft: 'auto',
    borderRadius: '15px 15px 0px 0px'
  },
  Info: {
    marginTop: 125,
    marginBottom: 100,
    marginRight: 'auto',
    marginLeft: 'auto',
    float: 'center'
  },
  Label: {
    color: 'white',
    marginRight: 8,
    padding: 4,
    background: 'grey',
    borderRadius: '4px'
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
    float: 'Left'
  }
};

export const LightBulb = React.createClass({
  propTypes: {
    id : PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  },

  getInitialState() {
    return {
      brightness: 0,
      on: false,
      asc: true
    };
  },

  componentDidMount(){
    this.interval = setInterval(() => {
      let url = "http://localhost:3000/lamp/"+ this.props.id +"/state";
      fetch(url).then((response) => response.json())
      .then(
        responseJson => {
          console.log(responseJson);
          this.setState({brightness : responseJson.brightness,on: responseJson.on});
        }

      );
    }, 100)
  },

  componentWillUnmount(){
    clearInterval(this.interval);
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
          <div style={Styles.Info}>
            <span style={Styles.Label}>State</span>{this.state.on?"On":"Off"}
            <br/><br/>
            <span style={Styles.Label}>Brightness</span>{this.state.brightness + "%"}
          </div>
      </div>
    )
  }
});

export default LightBulb;
