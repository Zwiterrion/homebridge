import React from 'react';
import LightBulb from './lightbulb'
import Lock from './lock'

const AccessoryApp = React.createClass({

  render () {
    return (
      <div className="grid">
          <div className="1/2 grid__cell">
            <LightBulb name="Light bulb 1" />
          </div>
          <div className="1/2 grid__cell">
            <LightBulb name="Light bulb 2" />
          </div>
          <div className="1/2 grid__cell">
            <Lock name="Lock 1" />
          </div>
          <div className="1/2 grid__cell">
            <LightBulb name="Light bulb 4" />
          </div>
      </div>
    );
  }
})

export default AccessoryApp