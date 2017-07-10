import React from 'react';
import LightBulb from './lightbulb'
import Lock from './lock'

const AccessoryApp = React.createClass({

  render () {
    return (
      <div className="grid">
        <div className="1/2 grid__cell">
          <LightBulb name="Lampe salon"
            id={1}
          />
        </div>
        <div className="1/2 grid__cell">
          <Lock name="Verrou entrée"
            id = {1}
          />
        </div>
        <div className="1/2 grid__cell">
          <Lock name="Verrou coffre fort"
            id={2}
          />
        </div>
        <div className="1/2 grid__cell">
          <LightBulb name="Lampe cuisine"
            id={2}
          />
        </div>
      </div>
    );
  }
})

export default AccessoryApp
