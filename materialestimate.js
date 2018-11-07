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

  console.log("create estimate...");
  console.log(req.body);
  common_db.getNextSequence('matl_estimate').then(function(data) {
    seq = data.id;
    return common_db.createMatlEstimate(data.id, req.body);

  }).then(function(data) {
    var result = {"id":parseInt(seq)};
    res.send(result);
  });

}),

/**
 * function
 *
 */

router.get('/list/all', function (req, res) {

  if (!req.body) return res.sendStatus(400)

  common_db.fetchEstimateList().
  then(function(data) {
    res.send(data);
  });

}),
/**
 * function
 *
 */

router.get('/list/job/:id', function (req, res) {

  if (!req.body) return res.sendStatus(400)

  common_db.fetchEstimateListByJob(req.params.id).
  then(function(data) {
    res.send(data);
  });

}),

/**
 * function
 *
 */

router.get('/delete/:id', function (req, res) {

  if (!req.body) return res.sendStatus(400)

  console.log("delete estimate");

  common_db.deleteEstimate(req.params.id).
  then(function(data) {
    res.send(data);
  });

}),

/**
 * function
 *
 */
router.post('/used', function (req, res) {

  if (!req.body) return res.sendStatus(400)
  common_db.fetchMatlUsedRow(req.body).
  then(function(data) {
    //if array of rows is empty, need to insert a row
    if(data.length == 0) {

      //end insert row
      return common_db.createMatlUsedRow(req.body);

    }
    else
      return data;

  }).then(function(data) {

    if(req.body.used_qty != null) {
      return common_db.updateMatlUsed(req.body);
    }
    return data;

  }).then(function(data) {
    if(req.body.used_qty != null) {
      return common_db.fetchMatlUsedRow(req.body);
    }
    else
     return data;
  }).then(function(data) {

      res.send(data);
  });

})


module.exports = router
