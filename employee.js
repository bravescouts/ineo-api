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


router.get('/:id', function (req, res) {

  if (!req.body) return res.sendStatus(400)
 
  common_db.fetchEmployee(req.params.id).
  then(function(data) {
    res.send(data.result);
  });

}),

/**
 * function
 *
 */

router.post('/create', function (req, res) {

  if (!req.body) return res.sendStatus(400)

  common_db.createEmployee(req.body).
  then(function(data) {
    res.send('done');
  });


}),

/**
 *  * function
 *   *
 *    */

router.get('/list/all', function (req, res) {

  if (!req.body) return res.sendStatus(400)

  common_db.fetchEmployeeList(req.params.id).
  then(function(data) {
    res.send(data);
  });

}),

/**
 *  * function
 *   *
 *    */

router.get('/delete/:id', function (req, res) {

  if (!req.body) return res.sendStatus(400)

  common_db.deleteEmployee(req.params.id).
  then(function(data) {
    res.send(data);
  });

}),

module.exports = router
