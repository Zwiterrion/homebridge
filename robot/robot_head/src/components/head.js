// import PropTypes from 'prop-types';
import React from 'react';
import config from '../config.json';

class Head extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            hover: false
        }
    }

    // propTypes: {}

    componentDidMount() {
        // var that = this;
        this.source = new EventSource(config.server + "sse");
        this.source.addEventListener(`sse_voice`, function (e) {
            // TODO call nice code to make the browser speak
            console.log(`sse : ${e.data}`);

        })
    } 

    componentWillUnmount(){
        this.source.removeAllListeners();
        this.source.close();
    }

    render() {
        return (
            <div>
            </div>
        )
    }


}

export default Head;
