var request = require("request");
var Service, Characteristic;


module.exports = function(homebridge){
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-floLock", "FloLock",
  FloLockAccessory);
}

function FloLockAccessory(log, config){
  this.log = log;
  this.name = config["name"];
  this.id = config["id"];
  this.lockName = config["lock_name"] || this.name; // this.name if lampName not defined
  this.log("Starting a floLock device with the name '" + this.lockName + "'");
}

/**
* check for the lampe current state (on/off)
*/
FloLockAccessory.prototype.isOn = function(callback){

  request.get({
    url: `http://localhost:3000/lock/${this.id}/state`
  }, function(err, response, body) {

    if (!err && response.statusCode == 200) {
      var json = JSON.parse(body);
      this.log(body);
      var on = json.on;
      console.log("The lock is " + (on ? "locked" : "unlocked"));
      callback(null, on); // success
    }
    else {
      this.log("Error getting state (status code %s): %s", response.statusCode, err);
      callback(err);
    }
  }.bind(this));

}

/*
* Turn on/off the lock
*/
FloLockAccessory.prototype.switch = function(switchOn, callback){
  request.get({
    url: `http://localhost:3000/lock/${this.id}/on/` + switchOn
  }, function(err, response, body) {

    if (!err && response.statusCode == 200) {
      var json = JSON.parse(body);
      var on = json.on;
      this.log("Lock state is %s", on ? "on":"off");
      callback(null, on); // success
    }
    else {
      this.log("Error getting state (status code %s): %s", response.statusCode, err);
      callback(err);
    }
  }.bind(this));
}


FloLockAccessory.prototype.getServices = function(){

  var lockMechanism = new Service.LockMechanism(this.name);

  lockMechanism
    .getCharacteristic(Characteristic.LockTargetState)
    .on('get', this.isOn.bind(this))
    .on('set', this.switch.bind(this));

  lockMechanism
      .getCharacteristic(Characteristic.LockCurrentState)
      .on('get', this.isOn.bind(this));

  return [lockMechanism];
}
