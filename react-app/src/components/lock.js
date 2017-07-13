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
    marginTop: 150,
    marginBottom: 150,
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

export const Lock = React.createClass({
  propTypes: {
    id : PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  },

  getInitialState() {
    return {
      locked: false
    };
  },

  componentDidMount(){
    var that = this;
    this.source = new EventSource("http://192.168.86.55:3000/update");
    this.source.addEventListener("open" ,function(e){
      console.log("sse : connection open");
    });
    this.source.addEventListener("connected" ,function(e){
      console.log("sse : " + e.data.welcomeMsg);
    })
    this.source.addEventListener(`lock${this.props.id}` ,function(e){
      console.log("sse : " + e.data);
      var on = JSON.parse(e.data).on;
      console.log("on :" + on);
      that.setState({locked : on});
    })
  },

  componentWillUnmount(){
    this.source.removeAllListeners();
    this.source.close();
  },

  render() {
    return (
      <div style={Styles.Card}>
          <h2 style={Styles.Title}> {this.props.name} </h2>
          <img style={Styles.Image}
              src={this.state.locked ? require(`../img/locked.png`): require('../img/unlocked.png')}
              width="250"
          />
          <div style={Styles.Info}>
            <span style={Styles.Label}>State</span>{this.state.locked?"Locked":"Unlocked"}
          </div>
      </div>
    )
  }
});

export default Lock
