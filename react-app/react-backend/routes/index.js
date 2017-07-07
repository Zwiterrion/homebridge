var express = require('express');
const fs = require('fs');
var router = express.Router();

const DIR_FILES = './files/';
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

/**
  * Read a json file and call the callback method passed in parameter with the
  * extracted object
  */
function readJsonFile(fileName, callbackSuccess, callbackError){
  if (!fs.existsSync(DIR_FILES + fileName)){
    if (!fs.existsSync(DIR_FILES)){
      fs.mkdirSync(DIR_FILES)
    }
    fs.writeFileSync(DIR_FILES + fileName, JSON.stringify(new Lightbulb()),'utf8');
  }
  fs.readFile(DIR_FILES + fileName, FILE_ENCODE, function (err, data){
    if (err){
      console.log("error opening file :" + DIR_FILES + fileName);
      callbackError.call(null);
    }else{
      let obj = JSON.parse(data);
      callbackSuccess.call(null,obj);
    }
  });
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/**
 * Switch on the lamp
 */
router.get('/lamp/on/:isOn', function (req, res){
  readJsonFile("lamp.json",
    (obj) => {
      obj.on = (req.params.isOn=="1");
      var json = JSON.stringify(obj);
      fs.writeFileSync('files/lamp.json', json, 'utf8');
      res.json(obj);
    },
    () => {}
  )
})


/**
 * Get the lamp object
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 */
router.get('/lamp/state', function(req, res){
  if (!fs.existsSync(DIR_FILES + 'lamp.json')){
    if (!fs.existsSync(DIR_FILES)){
      fs.mkdirSync(DIR_FILES)
    }
    fs.writeFileSync(DIR_FILES + 'lamp.json', JSON.stringify(new Lightbulb()),'utf8');
  }
  res.sendFile(DIR_FILES + "lamp.json", SEND_FILE_OPT, function(err){
    if(err){
        console.log(err);
        res.status(err.status).end();
    }
    else{
        console.log('Sent: ' + "lamp.json");
    }
  });
})

/**
 * Change the given charac
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 */
router.get('/lamp/:charac/:value', function(req, res){
  if (CHARACTERISTICS.includes(req.params.charac)){
    readJsonFile("lamp.json",
      (obj) => {
        obj[req.params.charac] = eval(req.params.value);
        var json = JSON.stringify(obj);
        fs.writeFileSync('files/lamp.json', json, 'utf8');

        res.json(obj);
      },
      () => {}
    )
  }else{
    console.log("Error : the specified characteristic does not exist.");
    res.status(404).send('Not found');
  }
})

module.exports = router;
