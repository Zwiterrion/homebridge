const express = require('express')
const fs = require('fs')
const app = express()
const ssevent = require('./ssevent.js')
const lamp = require('./lamp.js')
const lock = require('./lock.js')

const ee = ssevent.ee;
const startSees = ssevent.startSees;



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


// server side event subscription

app.get('/update',function(req, res){
  sse = startSees(res);
});

// lamp

app.get('/lamp/:id/on/:isOn', lamp.switch);
app.get('/lamp/:id/state', lamp.state);
app.get('/lamp/:id/:charac/:value', lamp.changeCarac);

// lock

app.get('/lock/:id/state', lock.state);
app.get('/lock/:id/on/:isOn', lock.switch);
