process.env.NODE_CONFIG_DIR = "/usr/local/etc/mw-config";
var config = require('config');
var request = require('request');
var winston = require('winston');
var Bluebird = require('bluebird');
var moment = require('moment');
const logfilepath = "/usr/local/etc/winston-logs/";
const { Pool } = require('pg');

var dbConfig = config.get('auth.dbConfig');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ name: 'info-file',  filename: logfilepath+'api.log', level: 'info' }),
    new (winston.transports.File)({ name: 'error-file', filename: logfilepath+'errors-api.log', level: 'error' })
  ]
});


const pool = new Pool({
  user: dbConfig.user,
  host: dbConfig.host,
  database: dbConfig.database,
  password: dbConfig.password
});

module.exports = {
/**
 * function 
 *
 */
 fetchUser: function(usr) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-user',
        text: "select * from employees where employee_id = $1",
        values: [usr]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();

            if(err)
              reject({"result":-1,"executed":query,"error":err});

            if(res.hasOwnProperty('rows') && res.rows.length > 0)
              resolve({"result":res.rows[0].first_name+" "+res.rows[0].last_name,"executed":query});
            else
              resolve({"result":null, "executed":query});
         })
      })

  })

  return promise;
},

/**
 * function
 *
 */
createEmployee: function(request, i_id, opp_id) {
  var promise = new Bluebird(
    function(resolve, reject) {

      var dt = new Date();

      const ins_stmt = {
        name: 'create-employee',
	text: 'INSERT INTO public.employees(first_name, last_name) VALUES ($1,$2)',
        values: [request.first_name, request.last_name]
      }

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(ins_stmt, (err, res) => {
            done();

            if(err)
              reject({"result":-1,"executed":ins_stmt,"error":err});

            resolve({"executed":ins_stmt});
            //resolve(res.rows[0]);
         })
      })

  })

  return promise;
}


};






