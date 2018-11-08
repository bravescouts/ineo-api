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


router.get('/countrylist', function (req, res) {

  if (!req.body) return res.sendStatus(400)

  console.log("countrylist");
  common_db.fetchCountryList(req.params.id).
  then(function(data) {
    res.send(data);
  });

}),

router.get('/attributes', function(req, res) {
  if (!req.body) return res.sendStatus(400)

  var mnu1;
  var mnu2;
  var mnu3;
  var mnu4;
  var mnu5;

  common_db.fetchAttributeMenu(1).then(function(data) {

    mnu1 = data;
    return common_db.fetchAttributeMenu(2);
  }).then(function(data) {

    mnu2 = data; 
    return common_db.fetchAttributeMenu(3);
  }).then(function(data) {

    mnu3 = data;
    return common_db.fetchAttributeMenu(4);
  }).then(function(data) {

    mnu4 = data;
    return common_db.fetchAttributeMenu(5);
  }).then(function(data) {

     mnu5 = data;
     res.send({"mnuMatlLength":mnu1, "mnuMatlThick":mnu2, "mnuMatlType":mnu3, "mnuLevel":mnu4, "mnuApplication":mnu5 });
  });

	
})

module.exports = router
