const FaceApi = require('../api/faceRecognition/FaceApi.js');
const fs = require('fs');
const gm = require('gm');
const logger = require('../utils/logger.js');
const { eventEmitter, events } = require('../events.js');
const util = require('util');

const faceApi = new FaceApi();

function processVideo(req, res) {
  const data = req.body;
  const buf = new Buffer(data, 'base64');
  //logger.debug(buf);
  const path0 = './src/img/test0.jpg';
  const path1 = './src/img/test1.jpg';
  fs.writeFileSync(path1, buf);

  const options = {
    tolerance: 0.03,
  };
  gm.compare(path0, path1, options, (err, isEqual, equality, raw) => {
    if (err) logger.warn(err);
    if (isEqual || err) {
      res.json(0);
    } else {
      faceApi.detectFace(req.body)
        .then(faceIds =>
          faceApi.identify(faceIds)
        )
        .then(personId =>
          // console.log(`person id : ${personId}`);
          faceApi.getPersonNames(personId)
        )
        .then((result) => {
          eventEmitter.emit(events.userEvents.faceRecognize, result);
          res.json(result);
        });
    }
    fs.rename(path1, path0, (err) => {
      if (err) logger.error(err);
    });
  });
}

module.exports = processVideo;
