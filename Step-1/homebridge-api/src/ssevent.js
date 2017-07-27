var EventEmitter = require('events').EventEmitter;

var ee = new EventEmitter();

var startSees = {

  subscribers : [],

  subscribe : function(res){
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write("\n");
    this.subscribers.push(res);
  },

  sseEventListen : function (){
    let that = this;
    ee.on('sse',function(name,data){
        that.subscribers.forEach( function(res){
        res.write("event: " + name + "\n");
        res.write("data: " + JSON.stringify(data) + "\n\n");
      })
    });
  }

};

exports.ee = ee;
exports.startSees = startSees;
