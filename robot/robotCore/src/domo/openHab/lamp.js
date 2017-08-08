const fetch = require('node-fetch')

const DEFAULT_STATE = {
	hue : 0,
	saturation : 0,
	value : 0
}

function OHLamp(baseURL, lampName, state = DEFAULT_STATE){
	this.baseURL = baseURL;
	this.lampName = lampName;
	this.state = state;

	const that = this;

	// private function
	function fetchPost(itemSuffixe, body){
		return fetch(`${that.baseURL}/items/${that.lampName}${itemSuffixe}`, {
			method : 'POST',
			headers : { 'content-type':'text/plain' },
			body : body
		}).then( result => console.log(result) )
			.catch( error => console.log(`error : ${error}`) )
	}


	this.turnOff = function(){
		return fetchPost(`_color`, `${this.state.hue},${this.state.saturation},0`);
	}


	this.turnOn = function(){
		return fetchPost(`_color`, `${this.state.hue},${this.state.saturation},100`);
	}


	this.setHue = function(hue){
		return fetchPost(`_color`, `${hue},${this.state.saturation},${this.state.value}`);
	}


	this.setSaturation = function(saturation) {
		return fetchPost(`_color`, `${this.state.hue},${saturation},${this.state.value}`);
	}


	this.setValue = function(value){
		return fetchPost(`_color`, `${this.state.hue},${this.state.saturation},${value}`);
	}

	// hsv is an array containing the 3 hsv value
	this.setColor = function(hsv){
		return fetchPost(`_color`, `${hsv}`);
	}

}

module.exports = OHLamp;
