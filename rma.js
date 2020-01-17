process.env.NODE_CONFIG_DIR = "/usr/local/etc/mw-config";
var express = require('express')
var router = express.Router()
var request = require('request');
var config = require('config');
var winston = require('winston');
const logfilepath = "/usr/local/etc/winston-logs/";
var common_db = require('./common_db');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ name: 'info-file',  filename: logfilepath+'api.log', level: 'info' }),
    new (winston.transports.File)({ name: 'error-file', filename: logfilepath+'errors-api.log', level: 'error' })
  ]
});


/**
 * function
 *
 */

router.post('/create', function (req, res) {

  if (!req.body) return res.sendStatus(400)

  common_db.getNextSequence('rma').then(function(data) {
    seq = data.id;
    return common_db.createRMA(data.id, 'new', req.body);

  }).then(function(data) {
    var result = {"id":parseInt(seq)};
    res.send(result);
  });


}),


/**
 * function
 *
 */

router.get('/delete/:refno', function (req, res) {

  if (!req.body) return res.sendStatus(400)

  console.log("delete rma");

  common_db.deleteRMA(req.params.refno).
  then(function(data) {
    res.send(data);
  });

}),

router.get('/:refno', function (req, res) {

  if (!req.body) return res.sendStatus(400)

  var rmaObj = null;
 
  common_db.fetchRMA(req.params.refno).
  then(function(data) {
 
    rmaObj = data.result;
 
    return common_db.fetchRMALines(data.result.id);

  })
  .then((r) => {

    var lines = [];
    for (var i=0; i<r.length; i++) {
      lines.push(r[i])
    }

    rmaObj.lines = lines;

    res.send(rmaObj);
  });


  //fetchRMALines
  //
  //

}),

router.get('/test', function (req, res) {


  res.send("rma ok");

}),


module.exports = router
