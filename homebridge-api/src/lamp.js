const ee = require('./ssevent.js').ee;
const fs = require('fs')

const DIR_FILES = 'accessories_states/';
const PRE_OBJ_NAME = 'lamp';
const FILE_ENCODE = "utf8";
const SEND_FILE_OPT = {
  root: __dirname + '/' + DIR_FILES,
  dotfiles: 'deny',
  headers: {
    'x-timestamp': Date.now(),
    'x-sent': true
  }
};
const CHARACTERISTICS = ['brightness','hue','saturation'];

/**
* Lightbulb object
* @constructor
*/
function Lightbulb(){
  this.on = true;
  this.brightness = 0;
  this.hue = 0;
  this.saturation = 0;
  this.name = "";
}


/**
* Read a json file and return its object
*/
function readJsonFile(fileName){
  data = fs.readFileSync(DIR_FILES + fileName, FILE_ENCODE);
  return JSON.parse(data);
}


// create file if it doesn't exist
function createLampFile(fileName){
  if (!fs.existsSync(DIR_FILES + fileName)){
    if (!fs.existsSync(DIR_FILES)){
      fs.mkdirSync(DIR_FILES)
      console.log("creating dir files");
    }
    console.log("creating file " + fileName);
    fs.writeFileSync(DIR_FILES + fileName, JSON.stringify(new Lightbulb()),'utf8');
  }
}


exports.switch = function (req, res){
  createLampFile("lamp" + req.params.id + ".json");
  obj = readJsonFile(PRE_OBJ_NAME + req.params.id + ".json");
  obj.on = (req.params.isOn=="1");
  let json = JSON.stringify(obj);
  fs.writeFileSync(DIR_FILES + PRE_OBJ_NAME + req.params.id + ".json", json, 'utf8');
  res.json(obj);
  ee.emit('sse',`lamp${req.params.id}`,obj);
};


exports.state = function(req, res){
  createLampFile("lamp" + req.params.id + ".json");
  res.sendFile(PRE_OBJ_NAME + req.params.id + ".json", SEND_FILE_OPT, function(err){
    if(err){
      console.log(err);
      res.status(err.status).end();
    }
  })
};


exports.changeCarac = function(req, res){
  if (CHARACTERISTICS.includes(req.params.charac)){
    let fileName = PRE_OBJ_NAME + req.params.id + ".json";
    createLampFile(fileName);
    obj = readJsonFile(fileName);
    obj[req.params.charac] = eval(req.params.value);
    obj.on = (obj.brightness != 0);
    let json = JSON.stringify(obj);
    fs.writeFileSync(DIR_FILES + PRE_OBJ_NAME + req.params.id + ".json", json, 'utf8');
    res.json(obj);
    ee.emit('sse',`lamp${req.params.id}`,obj);
  }else{
    console.log("Error : the specified characteristic does not exist.");
    res.status(404).send('Not found');
  }
};
