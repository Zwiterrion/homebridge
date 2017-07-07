var request = require("request");
var Service, Characteristic;


module.exports = function(homebridge){
   Service = homebridge.hap.Service;
   Characteristic = homebridge.hap.Characteristic;
   homebridge.registerAccessory("homebridge-thibLamp", "ThibLamp",
    ThibLampAccessory);
}

function ThibLampAccessory(log, config){
  this.log = log;
  this.name = config["name"];
  this.id = config["id"];
  this.lampName = config["lamp_name"] || this.name; // this.name if lampName not defined
  this.log("Starting a thibLamp device with the name '" + this.lampName + "'");
}

/**
* check for the lampe current state (on/off)
*/
ThibLampAccessory.prototype.isOn = function(callback){

  request.get({
    url: `http://localhost:3000/lamp/${this.id}/state`
  }, function(err, response, body) {

    if (!err && response.statusCode == 200) {
      var json = JSON.parse(body);
      this.log(body);
      var on = json.on;
      console.log("The lamp is " + (on ? "on" : "off"));
      callback(null, on); // success
    }
    else {
      this.log("Error getting state (status code %s): %s", response.statusCode, err);
      callback(err);
    }
  }.bind(this));

}

/*
* Turn on/off the lamp
*/
ThibLampAccessory.prototype.switch = function(switchOn, callback){
  request.get({
    url: `http://localhost:3000/lamp/${this.id}/on/` + switchOn
  }, function(err, response, body) {

    if (!err && response.statusCode == 200) {
      var json = JSON.parse(body);
      var on = json.on;
      this.log("Lamp state is %s", on ? "on":"off");
      callback(null, on); // success
    }
    else {
      this.log("Error getting state (status code %s): %s", response.statusCode, err);
      callback(err);
    }
  }.bind(this));
}

ThibLampAccessory.prototype.setBrightness = function(newBrightness,callback){

  request.get({
    url: `http://localhost:3000/lamp/${this.id}/brightness/` + newBrightness
  }, function(err, response, body) {

    if (!err && response.statusCode == 200) {
      var json = JSON.parse(body);
      var brightness = json.brightness;
      this.log("Lamp brightness is %s", brightness);
      callback(null, brightness); // success
    }
    else {
      this.log("Error getting state (status code %s): %s", response.statusCode, err);
      callback(err);
    }
  }.bind(this));

}

ThibLampAccessory.prototype.getBrightness = function(callback){
  request.get({
    url: `http://localhost:3000/${this.id}/lamp/state`
  }, function(err, response, body) {

    if (!err && response.statusCode == 200) {
      var json = JSON.parse(body);
      this.log(body);
      var brightness = json.brightness;
      this.log("Lamp brightness is %s", brightness);
      callback(null, brightness); // success
    }
    else {
      this.log("Error getting state (status code %s): %s", response.statusCode, err);
      callback(err);
    }
  }.bind(this));

}


ThibLampAccessory.prototype.getServices = function(){

  var lampService = new Service.Lightbulb(this.name);

  lampService
    .getCharacteristic(Characteristic.On)
    .on('get', this.isOn.bind(this))
    .on('set', this.switch.bind(this));

  lampService
    .getCharacteristic(Characteristic.Brightness)
    .on('get', this.getBrightness.bind(this))
    .on('set', this.setBrightness.bind(this))

  return [lampService];
}
