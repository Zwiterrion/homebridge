const fetch = require('node-fetch')

const DEFAULT_STATE = {
  control : "PAUSE",
  currentTitle : "",
  volume : 0
}

function OHSpeakers(baseURL, speakerName, state = DEFAULT_STATE){
  this.baseURL = baseURL;
  this.speakerName = speakerName;
  this.state = state;

  const that = this;

  // private function
  function fetchPost(itemSuffixe, body){
    return fetch(`${that.baseURL}/items/${that.speakerName}${itemSuffixe}`, {
      method : 'POST',
      headers : { 'content-type':'text/plain' },
      body : body
    }).then( result => console.log(result) )
    .catch( error => console.log(`error : ${error}`) )
  }

  this.play = function(){
    return fetchPost(`_control`, `PLAY`);
  }

  this.pause = function(){
    return fetchPost(`_control`,`PAUSE`);
  }

  this.setVolume = function(volume){
    return fetchPost(`_volume`,`${volume}`);
  }

}

module.exports = OHSpeakers;
