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

  common_db.getNextSequence('job').then(function(data) {
    seq = data.id;
    return common_db.createJob(data.id, req.body);

  }).then(function(data) {
    var result = {"id":parseInt(seq)};
    res.send(result);
  });


}),

/**
 * function
 *
 */

router.post('/update', function (req, res) {

  if (!req.body) return res.sendStatus(400)

  common_db.updateJob(req.body).
  then(function(data) {
    res.send(data);
  });


}),


/**
 * function
 *
 */

router.get('/list/all', function (req, res) {

  if (!req.body) return res.sendStatus(400)

  console.log("job list");
  common_db.fetchJobList(req.params.id).
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

  console.log("delete site");

  common_db.deleteJob(req.params.id).
  then(function(data) {
    res.send(data);
  });

}),

/**
 * function
 *
 */

router.get('/list/active/:siteID', function (req, res) {

  if (!req.body) return res.sendStatus(400)

  var estimateSummary = null;

  common_db.fetchActiveJobs(req.params.siteID).
  then(function(data) {

    var estimates = [];
    for (var i=0; i<data.length; i++) {
      var obj = Object.assign({id:(i+1)}, data[i]);
      estimates.push(obj)
    }

    estimateSummary = estimates;
    return common_db.fetchAreas(req.params.siteID);

  }).then(function(data) {

    var areas = [];
    for (var i=0; i<data.length; i++) {
      areas.push(data[i].text)
    }

    var result = {"estimateSummary":estimateSummary, "areas":areas};
    res.send(result);
  });

}),

/**
 * function
 *
 */

router.get('/list/site/:id', function (req, res) {

  if (!req.body) return res.sendStatus(400)

  console.log("job list by site");
  common_db.fetchJobsBySite(req.params.id).
  then(function(data) {
    res.send(data);
  });

}),

/**
 * function
 *
 */

router.get('/details/:id', function (req, res) {

  if (!req.body) return res.sendStatus(400)

  common_db.fetchJobDetails(req.params.id).
  then(function(data) {
    res.send(data);
  });

}),
/**
 * function
 *
 */

router.get('/calendar', function (req, res) {

  if (!req.body) return res.sendStatus(400)

  common_db.fetchJobEvents().
  then(function(data) {
    res.send(data);
  });

}),


module.exports = router
