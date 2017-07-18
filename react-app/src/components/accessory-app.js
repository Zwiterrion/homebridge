import React from 'react';
import LightBulb from './lightbulb'
import Lock from './lock'

const api = "http://192.168.86.55:3000"

const AccessoryApp = React.createClass({

  render () {
    return (
      <div className="grid">
        <div className="1/2 grid__cell">
          <LightBulb name="Lampe salon"
              id = {1}
              api = {api}
          />
        </div>
        <div className="1/2 grid__cell">
          <Lock name="Verrou entrée"
              id = {1}
              api = {api}
          />
        </div>
        <div className="1/2 grid__cell">
          <Lock name="Verrou coffre fort"
              id = {2}
              api = {api}
          />
        </div>
        <div className="1/2 grid__cell">
          <LightBulb name="Lampe cuisine"
              id = {2}
              api = {api}
          />
        </div>
      </div>
    );
  }
})

export default AccessoryApp
