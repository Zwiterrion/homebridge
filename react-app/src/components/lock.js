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
    background: 'linear-gradient(-180deg, rgb(226,213,186), rgb(236,226,226))',
    borderRadius: 20
  },
  Title: {
    fontWeight: 'bold',
    padding: 8,
    color: 'white',
    background: 'rgb(0,120,150)',
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
    api: PropTypes.string.isRequired,
    id : PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  },

  getInitialState() {
    return {
      locked: false
    };
  },

  componentDidMount(){

    let url = this.props.api + "/lock/"+ this.props.id +"/state";
    fetch(url).then((response) => response.json())
    .then(
      responseJson => {
        this.setState({locked : responseJson.on});
      }
    );

    var that = this;
    this.source = new EventSource(this.props.api + "/update");
    this.source.addEventListener(`lock${this.props.id}` ,function(e){
      var on = JSON.parse(e.data).on;
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
