const express = require('express')
const fs = require('fs')
const app = express()

const DIR_FILES = 'files/';
const PRE_OBJ_NAME = 'lamp';
const FILE_ENCODE = "utf8";
const SEND_FILE_OPT = {
    root: __dirname + '/files/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
};
const CHARACTERISTICS = ['brightness','hue','saturation'];

/**
 * Lightbulb object
 */
function Lightbulb(){
  this.on = true;
  this.brightness = 0;
  this.hue = 0;
  this.saturation = 0;
  this.name = "";
}

function Lock(){
  this.on = true;
}

/**
  * Read a json file and return its object
  */
function readJsonFile(fileName){
  data = fs.readFileSync(DIR_FILES + fileName, FILE_ENCODE);
  return JSON.parse(data);
}

// function readJsonFile(fileName, callbackSuccess, callbackError){
//   fs.readFile(DIR_FILES + fileName, FILE_ENCODE, function (err, data){
//     if (err){
//       console.log("error opening file :" + DIR_FILES + fileName);
//       callbackError.call(null);
//     }else{
//       let obj = JSON.parse(data);
//       callbackSuccess.call(null,obj);
//     }
//   });
// }

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

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
  res.send('Hello World!')
})



app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

/**
 * Switch on the lamp
 */
app.get('/lamp/:id/on/:isOn', function (req, res){
  createLampFile("lamp" + req.params.id + ".json");
  obj = readJsonFile(PRE_OBJ_NAME + req.params.id + ".json");
  obj.on = (req.params.isOn=="1");
  /*if(obj.on && obj.brightness == 0){
    obj.brightness = 100;
  }*/
  var json = JSON.stringify(obj);
  fs.writeFileSync(DIR_FILES + PRE_OBJ_NAME + req.params.id + ".json", json, 'utf8');
  res.json(obj);
})


/**
 * Get the lamp object
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 */
app.get('/lamp/:id/state', function(req, res){
  createLampFile("lamp" + req.params.id + ".json");
  res.sendFile(PRE_OBJ_NAME + req.params.id + ".json", SEND_FILE_OPT, function(err){
    if(err){
        console.log(err);
        res.status(err.status).end();
    }
  });
})

/**
 * Change the given charac (switch on the lamp too)
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 */
app.get('/lamp/:id/:charac/:value', function(req, res){
  if (CHARACTERISTICS.includes(req.params.charac)){
    let fileName = PRE_OBJ_NAME + req.params.id + ".json";
    createLampFile(fileName);
    obj = readJsonFile(fileName);
    obj[req.params.charac] = eval(req.params.value);
    //obj.on = (obj.brightness == 0)?false:true;
    obj.on = (obj.brightness != 0);
    var json = JSON.stringify(obj);
    console.log("changing carac : " + json);
    fs.writeFileSync(DIR_FILES + PRE_OBJ_NAME + req.params.id + ".json", json, 'utf8');
    res.json(obj);
  }else{
    console.log("Error : the specified characteristic does not exist.");
    res.status(404).send('Not found');
  }
})

app.get('/lock/:id/state', function(req, res){
  let fileName = "lock" + req.params.id + ".json";
  createLockFile(fileName);
  res.sendFile(fileName, SEND_FILE_OPT, function(err){
    if(err){
        console.log(err);
        res.status(err.status).end();
    }
  });
})

app.get('/lock/:id/on/:isOn', function(req, res){
  let fileName = "lock" + req.params.id + ".json";
  createLockFile(fileName);
  obj = readJsonFile(fileName);
      obj.on = (req.params.isOn=="1");
      var json = JSON.stringify(obj);
      fs.writeFileSync(DIR_FILES + "lock" + req.params.id + ".json", json, 'utf8');
      res.json(obj);
})
