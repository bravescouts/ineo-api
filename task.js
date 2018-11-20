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

  common_db.getNextSequence('task').then(function(data) {
    seq = data.id;
    return common_db.createTask(data.id, req.body);

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

  common_db.updateTask(req.body).
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

  common_db.fetchTaskList().
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

  common_db.deleteTask(req.params.id).
  then(function(data) {
    res.send(data);
  });

})


module.exports = router
