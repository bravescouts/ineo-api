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
createSite: function(id, request) {
  var promise = new Bluebird(
    function(resolve, reject) {

      var dt = new Date();

      const ins_stmt = {
        name: 'create-site',
        text: 'INSERT INTO public.site(id, site_name, contact_name, type, phone, address_1, address_2, city, postal_code, province, country, county, latitude, longitude, cust_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',
        values: [id, request.site_name, request.contact_name, request.type, request.phone, request.address_1, request.address_2, request.city, request.postal_code, request.province, request.country, request.county, request.latitude, request.longitude, request.cust_id]
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
createJob: function(id, request) {
  var promise = new Bluebird(
    function(resolve, reject) {

      var dt = new Date();

      const ins_stmt = {
        name: 'create-job',
        text: 'INSERT INTO public.job(id, cust_id, site_id, name, supervisor_id, contact_name, start_date, type, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        values: [id, request.cust_id, request.site_id, request.name, request.supervisor_id, request.contact_name, request.start_date, request.type, request.status]
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
createMatlEstimate: function(id, request) {
  var promise = new Bluebird(
    function(resolve, reject) {

      var dt = new Date();

      const ins_stmt = {
        name: 'create-estimate',
        text: 'INSERT INTO public.matl_estimate(id, job_id, area, area_level, application_type, matl_type, matl_length, matl_dim, matl_attr1, matl_attr2, matl_attr3, matl_attr4, matl_attr5, qty) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',
        values: [id, request.job_id, request.area, request.area_level, request.application_type, request.matl_type, request.matl_length, request.matl_dim, request.matl_attr1, request.matl_attr2, request.matl_attr3, request.matl_attr4, request.matl_attr5, request.qty]
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

/**
 * function
 *
 */
 fetchCustomerList: function() {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-cutstomerlist',
        text: 'select id, customer_name as value, customer_name, first_name, last_name, phone, address_1, address_2, city, postal_code, province, country, county from customer',
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();
            if(err)
              reject({"result":-1,"executed":query,"error":err});

            else {
              resolve(res.rows);

            }
         })
      })

  })

  return promise;
},
/**
 * function
 *
 */
 deleteCustomer: function(id) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'delete-customer',
        text: "delete from customer where id = $1",
        values: [id]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();

            if(err)
              reject({"result":-1,"executed":query,"error":err});

            else
              resolve({"deleted customer id":id});
         })
      })

  })

  return promise;
},

/**
 * function
 *
 */
 fetchSiteList: function() {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-sitelist',
        text: 'SELECT id, site_name, contact_name, type, phone, address_1, address_2, city, postal_code, province, country, county, latitude, longitude, cust_id FROM site'
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();
            if(err)
              reject({"result":-1,"executed":query,"error":err});

            else {
              resolve(res.rows);

            }
         })
      })

  })

  return promise;
},

/**
 * function
 *
 */
 fetchJobList: function() {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-joblist',
        text: 'SELECT id, cust_id, site_id, name, supervisor_id, contact_name, to_char(start_date, \'YYYY-MM-DD\') as start_date, type, status from job'
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();
            if(err)
              reject({"result":-1,"executed":query,"error":err});

            else {
              resolve(res.rows);

            }
         })
      })

  })

  return promise;
},

/**
 * function
 *
 */
 fetchJobsBySite: function(id) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-joblistbysite',
        text: 'SELECT id, cust_id, site_id, name, supervisor_id, contact_name, to_char(start_date, \'YYYY-MM-DD\') as start_date, type, status from job where site_id = $1',
        values: [id]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();
            if(err)
              reject({"result":-1,"executed":query,"error":err});

            else {
              resolve(res.rows);

            }
         })
      })

  })

  return promise;
},

/**
 * function
 *
 */
 fetchEstimateList: function() {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-estimatelist',
        text: 'SELECT id, job_id, area, area_level, application_type, matl_type, matl_length, matl_dim, matl_attr1, matl_attr2, matl_attr3, matl_attr4, matl_attr5, qty FROM matl_estimate'
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();
            if(err)
              reject({"result":-1,"executed":query,"error":err});

            else {
              resolve(res.rows);

            }
         })
      })

  })

  return promise;
},

/**
 * function
 *
 */
 fetchEstimateListByJob: function(id) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-estimatelist',
        text: 'SELECT id, job_id, area, area_level, application_type, matl_type, matl_length, matl_dim, matl_attr1, matl_attr2, matl_attr3, matl_attr4, matl_attr5, qty FROM matl_estimate WHERE job_id = $1',
        values: [id]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();
            if(err)
              reject({"result":-1,"executed":query,"error":err});

            else {
              resolve(res.rows);

            }
         })
      })

  })

  return promise;
},

/**
 * function
 *
 */
 deleteSite: function(id) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'delete-site',
        text: "delete from site where id = $1",
        values: [id]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();

            if(err)
              reject({"result":-1,"executed":query,"error":err});

            else
              resolve({"deleted site id":id});
         })
      })

  })

  return promise;
},

/**
 * function
 *
 */
 deleteEstimate: function(id) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'delete-estimate',
        text: "delete from matl_estimate where id = $1",
        values: [id]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();

            if(err)
              reject({"result":-1,"executed":query,"error":err});

            else
              resolve({"deleted estimate id":id});
         })
      })

  })

  return promise;
},
/**
 * function
 *
 */
 fetchSiteListByCustomer: function(id) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-sitelistbycust',
        text: 'SELECT id, site_name, contact_name, type, phone, address_1, address_2, city, postal_code, province, country, county, latitude, longitude, cust_id FROM site WHERE cust_id = $1',
        values: [id]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();
            if(err)
              reject({"result":-1,"executed":query,"error":err});

            else {
              resolve(res.rows);

            }
         })
      })

  })

  return promise;
},

/**
 * function
 *
 */
 deleteJob: function(id) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'delete-job',
        text: "delete from job where id = $1",
        values: [id]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();

            if(err)
              reject({"result":-1,"executed":query,"error":err});

            else
              resolve({"deleted job id":id});
         })
      })

  })

  return promise;
},

/**
 * function
 *
 */
fetchActiveJobs: function(id) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-activejobs',
        text: 'select job.name as jobname, est.job_id, est.area_level, mlen.text as len, mlen.value as lenID, mthick.text as thick, mthick.value as thickID, mtype.text as material, mtype.value as materialID, sum(qty) as qty, job.status, COALESCE(used.used_qty,0) as used_qty from job, matl_attributes mtype, matl_attributes mlen, matl_attributes mthick, matl_estimate as est left outer join matl_used as used on (est.job_id = used.job_id and est.matl_type = used.matl_type and est.matl_length = used.matl_length and est.matl_dim = used.matl_dim) where job.site_id = $1 and est.job_id = job.id and job.status = 1 and est.matl_type = mtype.value and est.job_id = job.id and mtype.attrib_id = 3 and est.matl_length = mlen.value and mlen.attrib_id = 1 and mthick.attrib_id = 2 and est.matl_dim = mthick.value group by jobname, est.job_id, est.area_level, len, lenID, thick, thickID, material, materialID, job.status, used_qty order by job_id, material',
        values: [id]
      };
      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();
            if(err)
              reject({"result":-1,"executed":query,"error":err});

            else {
              resolve(res.rows);

            }
         })
      })

  })

  return promise;
},

/**
 * function
 *
 */
fetchSiteTags: function() {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-sitetags',
	text: 'SELECT concat(site_name,address_1) as text, site.id as value, site.cust_id, job.id as job_id, greatest(job.created) FROM site, job where job.site_id = site.id'
      };
      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();
            if(err)
              reject({"result":-1,"executed":query,"error":err});

            else {
              resolve(res.rows);

            }
         })
      })

  })

  return promise;
},

/**
 * function
 *
 */
 fetchJobDetails: function(id) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-jobdetails',
        text: 'select j.id, c.customer_name, j.name as jobname, s.address_1 as jobaddress, s.city, s.phone, j.start_date, count(m.area) numestimates from customer c, job j, site s, matl_estimate m where j.id = $1 and j.cust_id = c.id and s.id = j.site_id and m.job_id = j.id group by j.id, c.customer_name, jobname, jobaddress, s.city, s.phone, j.start_date',
        values: [id]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();
            if(err)
              reject({"result":-1,"executed":query,"error":err});

            else {
              resolve(res.rows);

            }
         })
      })

  })

  return promise;
},

/**
 * function
 *
 */
fetchSite: function(id) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-sitelistbycust',
        text: 'SELECT id, site_name, contact_name, type, phone, address_1, address_2, city, postal_code, province, country, county, latitude, longitude, cust_id FROM site WHERE id = $1',
        values: [id]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();
            if(err)
              reject({"result":-1,"executed":query,"error":err});

            else {
              resolve(res.rows);

            }
         })
      })

  })

  return promise;
},

/**
 * function
 *
 */
fetchAreas: function(id) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-areas',
        text: 'SELECT distinct area as text FROM matl_estimate m, job j where m.job_id = j.id and j.site_id = $1', 
        values: [id]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();
            if(err)
              reject({"result":-1,"executed":query,"error":err});

            else {
              console.log(res.rows);
              resolve(res.rows);

            }
         })
      })

  })

  return promise;
},

/**
 * function
 *
 */
fetchMatlUsedRow: function(data) {
  var promise = new Bluebird(
    function(resolve, reject) {
  
      const query = {
        name: 'fetch-matl-used-row',
        text: 'SELECT job_id, area_level, matl_type, matl_length, matl_dim, used_qty FROM matl_used WHERE job_id = $1 AND area_level = $2 AND matl_type = $3 AND matl_length = $4 AND matl_dim = $5', 
        values: [data.job_id, data.area_level, data.matl_type, data.matl_length, data.matl_dim]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();
            if(err)
              reject({"result":-1,"executed":query,"error":err});

            else {
              resolve(res.rows);

            }
         })
      })

  })

  return promise;

},

/**
 * function
 *
 */
createMatlUsedRow: function(request) {

  var promise = new Bluebird(
    function(resolve, reject) {

      var dt = new Date();

      const ins_stmt = {
        name: 'create-matl-used-row',
        text: 'INSERT INTO matl_used(job_id, area_level, matl_type, matl_length, matl_dim, used_qty) VALUES ($1,$2,$3,$4,$5,0)',
        values: [request.job_id, request.area_level, request.matl_type, request.matl_length, request.matl_dim]
      }

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(ins_stmt, (err, res) => {
            done();

            if(err)
              reject({"result":-1,"executed":ins_stmt,"error":err});

	    //return a row representing a new record with empty used_qty
	    var result = Object.assign({used_qty:null}, request); 

            resolve(result);
         })
      })

  })

  return promise;
},

/**
 * function
 *
 */
updateMatlUsed: function(request) {

  var promise = new Bluebird(
    function(resolve, reject) {

      var dt = new Date();

      const ins_stmt = {
        name: 'update-matl-used-row',
        text: 'UPDATE matl_used SET used_qty = used_qty + $1 WHERE job_id=$2 AND area_level=$3 AND matl_type=$4 AND matl_length=$5 AND matl_dim=$6',
        values: [request.used_qty, request.job_id, request.area_level, request.matl_type, request.matl_length, request.matl_dim]
      }

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(ins_stmt, (err, res) => {
            done();

            if(err)
              reject({"result":-1,"executed":ins_stmt,"error":err});

            //return a row representing a new record with empty used_qty
            var result = Object.assign({used_qty:null}, request);

            resolve(result);
         })
      })

  })

  return promise;
},

/**
 * function
 *
 */
fetchAttributeMenu: function(id) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-matl-used-row',
        text: 'select text, value FROM matl_attributes where attrib_id = $1',
        values: [id]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();
            if(err)
              reject({"result":-1,"executed":query,"error":err});

            else {
              resolve(res.rows);

            }
         })
      })

  })

  return promise;

},

};

