const ee = require('./ssevent.js').ee;
const fs = require('fs')

const DIR_FILES = 'accessories_states/';
const PRE_OBJ_NAME = 'lock';
const FILE_ENCODE = "utf8";
const SEND_FILE_OPT = {
  root: __dirname + '/' + DIR_FILES,
  dotfiles: 'deny',
  headers: {
    'x-timestamp': Date.now(),
    'x-sent': true
  }
};

function Lock(){
  this.on = true;
}

function createLockFile(fileName){
  if (!fs.existsSync(DIR_FILES + fileName)){
    if (!fs.existsSync(DIR_FILES)){
      fs.mkdirSync(DIR_FILES)
      console.log("creating dir files");
    }
    console.log("creating file " + fileName);
    fs.writeFileSync(DIR_FILES + fileName, JSON.stringify(new Lock()),'utf8');
  }
}

/**
* Read a json file and return its object
*/
function readJsonFile(fileName){
  data = fs.readFileSync(DIR_FILES + fileName, FILE_ENCODE);
  return JSON.parse(data);
}

exports.state = function(req, res){
  let fileName = "lock" + req.params.id + ".json";
  createLockFile(fileName);
  res.sendFile(fileName, SEND_FILE_OPT, function(err){
    if(err){
      console.log(err);
      res.status(err.status).end();
    }
  });
}

exports.switch = function(req, res){
  let fileName = "lock" + req.params.id + ".json";
  createLockFile(fileName);
  obj = readJsonFile(fileName);
  obj.on = (req.params.isOn=="1");
  var json = JSON.stringify(obj);
  fs.writeFileSync(DIR_FILES + PRE_OBJ_NAME + req.params.id + ".json", json, 'utf8');
  res.json(obj);
  ee.emit('sse',`lock${req.params.id}`,obj);
}
