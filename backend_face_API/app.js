var express = require('express');
var basicAuth = require('basic-auth-connect');

var app = express();

app.use(basicAuth('serli', '5mmB#H-P=u.{m3zT'));
app.use(express.static('face-recognition/public'));

var port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`Example app listening on port ${port} !`);
});
