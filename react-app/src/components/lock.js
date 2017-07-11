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
    this.interval = setInterval(() => {
      let url = "http://localhost:3000/lock/"+ this.props.id +"/state";
      fetch(url).then((response) => response.json())
      .then(
        responseJson => {
          console.log(responseJson);
          this.setState({locked : responseJson.on});
        }

      );
    }, 100)
  },

  componentWillUnmount(){
    clearInterval(this.interval);
  },

  // handleClick() {
  //   const old = this.state.locked;
  //   let url = "http://localhost:3000/lock/"+ this.props.id +"/on/" + !old;
  //   fetch(url);
  // },

  render() {
    return (
      <div style={Styles.Card}>
          <h2 style={Styles.Title}> {this.props.name} </h2>
          <img style={Styles.Image}
              src={this.state.locked ? require(`../img/locked.png`): require('../img/unlocked.png')}
              width="250"
              //onClick={this.handleClick}
          />
      </div>
    )
  }
});

export default Lock
