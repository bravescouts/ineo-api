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
 fetchEmployee: function(usr) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-user',
        text: "select * from employee where id = $1",
        values: [usr]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();

            if(err)
              reject({"result":-1,"executed":query,"error":err});

            if(res.hasOwnProperty('rows') && res.rows.length > 0)
              resolve({"result":{"first_name":res.rows[0].first_name, "last_name":res.rows[0].last_name},"executed":query});
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
	text: 'INSERT INTO public.employee(first_name, last_name) VALUES ($1,$2)',
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
},

/**
 * function
 *
 */
 fetchCustomer: function(usr) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-customer',
        text: "select * from customer where id = $1",
        values: [usr]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();

            if(err)
              reject({"result":-1,"executed":query,"error":err});

            if(res.hasOwnProperty('rows') && res.rows.length > 0)
              resolve({"result":{
		        "customer_name":res.rows[0].customer_name,
		        "first_name":res.rows[0].first_name,
		        "last_name":res.rows[0].last_name,
		        "phone":res.rows[0].phone,
		        "address_1":res.rows[0].address_1,
		        "address_2":res.rows[0].address_2,
		        "city":res.rows[0].city,
		        "postal_code":res.rows[0].postal_code,
		        "province":res.rows[0].province,
		        "country":res.rows[0].country,
		        "county":res.rows[0].county
	              },"executed":query});
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
createCustomer: function(id, request) {
  var promise = new Bluebird(
    function(resolve, reject) {

      var dt = new Date();

      const ins_stmt = {
        name: 'create-customer',
        text: 'INSERT INTO public.customer(id, customer_name, first_name, last_name, phone, address_1, address_2, city, postal_code, province, country, county) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
        values: [id, request.customer_name, request.first_name, request.last_name, request.phone, request.address_1, request.address_2, request.city, request.postal_code, request.province, request.country, request.county]
      }

      pool.connect((err, client, done) => {

          client.query(ins_stmt, (err, res) => {
            done();
            if(err)
              reject({"result":-1,"executed":ins_stmt,"error":err});

            resolve({"executed":ins_stmt});
         });
      });
  })

  return promise;
},

/**
 * function
 *
 */
createSite: function(request, i_id, opp_id) {
  var promise = new Bluebird(
    function(resolve, reject) {

      var dt = new Date();

      const ins_stmt = {
        name: 'create-site',
        text: 'INSERT INTO public.site(site_name, contact_name, type, phone, address_1, address_2, city, postal_code, province, country, county, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
        values: [request.site_name, request.contact_name, request.type, request.phone, request.address_1, request.address_2, request.city, request.postal_code, request.province, request.country, request.county, request.latitude, request.longitude]
      }

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(ins_stmt, (err, res) => {
            done();

            if(err) {
	      console.log(err);
              reject({"result":-1,"executed":ins_stmt,"error":err});

            }
            resolve({"executed":ins_stmt});
            //resolve(res.rows[0]);
         })
      })

  })

  return promise;
},

/**
 * function
 *
 */
createJob: function(request, i_id, opp_id) {
  var promise = new Bluebird(
    function(resolve, reject) {

      var dt = new Date();

      const ins_stmt = {
        name: 'create-job',
        text: 'INSERT INTO public.job(cust_id, site_id, name, supervisor_id, contact_name, start_date, type, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        values: [request.cust_id, request.site_id, request.name, request.supervisor_id, request.contact_name, request.start_date, request.type, request.status]
      }

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(ins_stmt, (err, res) => {
            done();

            if(err) {
              console.log(err);
              reject({"result":-1,"executed":ins_stmt,"error":err});

            }
            resolve({"executed":ins_stmt});
            //resolve(res.rows[0]);
         })
      })

  })

  return promise;
},

/**
 * function
 *
 */
createMatlEstimate: function(request, i_id, opp_id) {
  var promise = new Bluebird(
    function(resolve, reject) {

      var dt = new Date();

      const ins_stmt = {
        name: 'create-estimate',
        text: 'INSERT INTO public.matl_estimate(job_id, area, area_level, application_type, matl_type, matl_size, matl_dim, matl_attr1, matl_attr2, matl_attr3, matl_attr4, matl_attr5, qty) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
        values: [request.job_id, request.area, request.area_level, request.application_type, request.matl_type, request.matl_size, request.matl_dim, request.matl_attr1, request.matl_attr2, request.matl_attr3, request.matl_attr4, request.matl_attr5, request.qty]
      }

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(ins_stmt, (err, res) => {
            done();

            if(err) {
              console.log(err);
              reject({"result":-1,"executed":ins_stmt,"error":err});

            }
            resolve({"executed":ins_stmt});
            //resolve(res.rows[0]);
         })
      })

  })

  return promise;
},

/**
 * function
 *
 */
 fetchRule: function(usr) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-rule',
        text: "select * from rule where id = $1",
        values: [usr]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();

            if(err)
              reject({"result":-1,"executed":query,"error":err});

            if(res.hasOwnProperty('rows') && res.rows.length > 0)
              resolve({"result":{"condition":res.rows[0].condition},"executed":query});
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
 getNextSequence: function(tbl) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-seq',
	text: "select nextval(pg_get_serial_sequence($1, 'id'))",
        values: [tbl]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();
            if(err)
              reject({"result":-1,"executed":query,"error":err});

            if(res.rowCount == 1) {

	      console.log("seq = " + res.rows[0].nextval);
              resolve({"id":res.rows[0].nextval});
            }
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
 fetchCountryList: function() {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-countrylist',
        text: "select id, name from country",
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();
            if(err)
              reject({"result":-1,"executed":query,"error":err});
            
            else {
	      console.log(res);
              resolve(res.rows);

	    }
         })
      })

  })

  return promise;
},



};

