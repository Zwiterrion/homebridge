var EventEmitter = require('events').EventEmitter;

var ee = new EventEmitter();

var startSees = function (res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write("\n");

  var sseFunc = function sendSse(name,data,id) {
    res.write("event: " + name + "\n");
    if(id) res.write("id: " + id + "\n");
    res.write("data: " + JSON.stringify(data) + "\n\n");
  };

  ee.on('sse',function(topic,data){
    sseFunc(topic,data);
  });

  return sseFunc;
};

exports.ee = ee;
exports.startSees = startSees;
