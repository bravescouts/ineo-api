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
  user: 'postgres',
  host: '127.0.0.1',
  database: 'ineo',
  password: 'Overl0rd1944' 
});

const poolTraining = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'training',
  password: 'Overl0rd1944'
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
              resolve({"result":{"first_name":res.rows[0].first_name, "last_name":res.rows[0].last_name, "phone":res.rows[0].phone},"executed":query});
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
	text: 'INSERT INTO public.employee(first_name, last_name, phone) VALUES ($1,$2,$3)',
        values: [request.first_name, request.last_name, request.phone]
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
		        "county":res.rows[0].county,
                        "email":res.rows[0].email
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
        text: 'INSERT INTO public.matl_estimate(id, job_id, area, area_level, application_type, matl_type, matl_length, matl_dim, matl_attr1, matl_attr2, matl_attr3, matl_attr4, matl_attr5, qty, created) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',
        values: [id, request.job_id, request.area, request.area_level, request.application_type, request.matl_type, request.matl_length, request.matl_dim, request.matl_attr1, request.matl_attr2, request.matl_attr3, request.matl_attr4, request.matl_attr5, request.qty, 'now()']
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
        text: 'select id, customer_name as value, customer_name, first_name, last_name, phone, address_1, address_2, city, postal_code, province, country, county, email from customer',
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
 *  
 */
 deleteEmployee: function(id) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'delete-employee',
        text: "delete from employee where id = $1",
        values: [id]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();

            if(err)
              reject({"result":-1,"executed":query,"error":err});

            else
              resolve({"deleted employee id":id});
         })
      })

  })

  return promise;
},
/**
 *  
 */
 fetchEmployeeList: function() {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-employeelist',
        text: "select id, first_name, last_name, phone from employee",
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

//for testing autocomplete
fetchModels: function(val) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-sitetags',
        text: 'select model from model where model like $1',
        values:['%'+val+'%']

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
        text: 'select \'C\' as type,id as value, customer_name as text, id as cust_id from customer UNION select \'J\' as type,id as value, name as text, cust_id  from job'
	//text: 'SELECT concat(site_name,address_1) as text, site.id as value, site.cust_id, job.id as job_id, greatest(job.created) FROM site, job where job.site_id = site.id'
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

/**
 * function
 *
 */
updateJob: function(request) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'update-job',
        text: 'UPDATE job SET cust_id= $1, site_id= $2, name= $3, supervisor_id= $4, contact_name= $5, start_date= $6, type= $7, status= $8 WHERE id = $9', 
        values: [request.cust_id, request.site_id, request.name, request.supervisor_id, request.contact_name, request.start_date, request.type, request.status, request.id]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();
            if(err)
              reject({"result":-1,"executed":query,"error":err});

            else {
              resolve({id:request.id});

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
updateSite: function(request) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'update-site',
        text: 'UPDATE public.site SET site_name=$1, contact_name=$2, type=$3, phone=$4, address_1=$5, address_2=$6, city=$7, postal_code=$8, province=$9, country=$10, county=$11, latitude=$12, longitude=$13, cust_id=$14 WHERE id = $15',
        values: [request.site_name, request.contact_name, request.type, request.phone, request.address_1, request.address_2, request.city, request.postal_code, request.province, request.country, request.county, request.latitude, request.longitude, request.cust_id, request.id]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();
            if(err)
              reject({"result":-1,"executed":query,"error":err});

            else {
              resolve({id:request.id});

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
updateCustomer: function(request) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'update-customer',
        text: 'UPDATE public.customer SET customer_name=$1, first_name=$2, last_name=$3, phone=$4, address_1=$5, address_2=$6, city=$7, postal_code=$8, province=$9, country=$10, county=$11, email=$12 WHERE ID = $13',
        values: [request.customer_name, request.first_name, request.last_name, request.phone, request.address_1, request.address_2, request.city, request.postal_code, request.province, request.country, request.county, request.email, request.id]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();
            if(err)
              reject({"result":-1,"executed":query,"error":err});

            else {
              resolve({id:request.id});

            }
         })
      })

  })

  return promise;

},
/**
 * function: updateEstimate
 *
 */
updateEstimate: function(request) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'update-estimate',
        text: 'UPDATE public.matl_estimate SET area=$1, area_level=$2, application_type=$3, matl_type=$4, matl_length=$5, matl_dim=$6, matl_attr1=$7, matl_attr2=$8, matl_attr3=$9, matl_attr4=$10, matl_attr5=$11, qty=$12, updated=now() WHERE id = $13',
        values: [request.area, request.area_level, request.application_type, request.matl_type, request.matl_length, request.matl_dim, null, null, null, null, null, parseInt(request.qty), request.id]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();
            if(err) {
		 console.log(err);
              reject({"result":-1,"executed":query,"error":err});

	    }
            else {
              resolve({id:request.id});

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
createNote: function(id, request) {
  var promise = new Bluebird(
    function(resolve, reject) {

      var dt = new Date();

      const ins_stmt = {
        name: 'create-note',
        text: 'INSERT INTO public.note(id, job_id, site_id, customer_id, note, created) VALUES ($1, $2, $3, $4, $5, now())',
        values: [id, request.job_id, request.site_id, request.customer_id, request.note]
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
createTask: function(id, request) {
  var promise = new Bluebird(
    function(resolve, reject) {

      var dt = new Date();

      const ins_stmt = {
        name: 'create-task',
        text: 'INSERT INTO public.task(id, text, created, start_date, end_date) VALUES ($1, $2, now(), $3, $4)',
        values: [id, request.text, request.start, request.end]
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
 fetchNotesByJob: function(id) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-notes-by-job',
        text: "select * from note where job_id = $1",
        values: [id]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();

            if(err)
              reject({"result":-1,"executed":query,"error":err});

            if(res != null && res.hasOwnProperty('rows') && res.rows.length > 0)
              resolve(res.rows);
            else
              resolve({"result":null, "executed":query});
         })
      })

  })

  return promise;
},
/**
 *  * function 
 *   *
 *    */
 fetchNotesByCustomer: function(id) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-notes-by-customer',
        text: "select * from note where customer_id = $1",
        values: [id]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();

            if(err)
              reject({"result":-1,"executed":query,"error":err});

            if(res != null && res.hasOwnProperty('rows') && res.rows.length > 0)
              resolve(res.rows);
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
fetchJobEvents: function() {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-job-events',
        text: "SELECT site.address_1, site.city, site.postal_code, job.id, job.name as title, concat(job.start_date,'T08:00:00') as start, 'teal' as color, job.site_id, job.cust_id FROM job, site where site.id = job.site_id"
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();

            if(err)
              reject({"result":-1,"executed":query,"error":err});

            if(res.hasOwnProperty('rows') && res.rows.length > 0)
              resolve(res.rows);
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
 fetchTaskList: function() {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-all-tasks',
        text: "select id, start_date as start, end_date as end, text as title, 'orange' as color, 'task' as type from task order by start"
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();

            if(err)
              reject({"result":-1,"executed":query,"error":err});

            if(res.hasOwnProperty('rows') && res.rows.length > 0)
              resolve(res.rows);
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
 deleteTask: function(id) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'delete-task',
        text: "delete from task where id = $1",
        values: [id]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();

            if(err)
              reject({"result":-1,"executed":query,"error":err});

            else
              resolve({"deleted task id":id});
         })
      })

  })

  return promise;
},

/**
 * function
 *
 */
updateTask: function(request) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'update-task',
        text: 'UPDATE public.task SET end_date = $1 where id = $2',
        values: [request.end, request.id]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();
            if(err)
              reject({"result":-1,"executed":query,"error":err});

            else {
              resolve({id:request.id});

            }
         })
      })

  })

  return promise;

},

 fetchContentByID: function(id) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-content',
        text: "select source from source_content where id = $1",
        values: [id]
      };

      poolTraining.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();

            if(err) {
              console.log(err);
              reject({"result":-1,"executed":query,"error":err});

            }

            if(res.hasOwnProperty('rows') && res.rows.length > 0)
              resolve(res.rows);
            else
              resolve({"result":null, "executed":query});
         })
      })

  })

  return promise;
},

/**
 *  function
 *  
 **/
createRMA: function(id, status, request) {
  var promise = new Bluebird(
    function(resolve, reject) {

      var dt = new Date();

      const ins_stmt = {
        name: 'create-rma',
	text: 'INSERT INTO public.rma(id, name, refno, status, c_id, created) VALUES ($1,$2,$3,$4,$5,$6)',
        values: [id, request.name, request.refno, status, request.c_id, 'now()']
      }

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(ins_stmt, (err, res) => {
            done();

            if(err)
              reject({"result":-1,"executed":ins_stmt,"error":err});

            resolve({"executed":ins_stmt});
           
         })
      })

  })

  return promise;
},

 fetchRMA: function(refno) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-rma',
        text: "select * from rma where refno = $1",
        values: [refno]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();

            if(err)
              reject({"result":-1,"executed":query,"error":err});

            if(res.hasOwnProperty('rows') && res.rows.length > 0)
              resolve({"result":{
		        "id":res.rows[0].id,
		        "created":res.rows[0].created,
		        "name":res.rows[0].name,
		        "c_id":res.rows[0].c_id,
		        "refno":res.rows[0].refno,
		        "status":res.rows[0].status },"executed":query});
            else
              resolve({"result":null, "executed":query});
         })
      })

  })

  return promise;
},

deleteRMA: function(refno) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'delete-rma',
        text: "delete from rma where refno = $1",
        values: [refno]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();

            if(err)
              reject({"result":-1,"executed":query,"error":err});

            else
              resolve({"deleted rma refno":refno});
         })
      })

  })

  return promise;
},

createRMALine: function(id, status, request) {
  var promise = new Bluebird(
    function(resolve, reject) {

      var dt = new Date();

      const ins_stmt = {
        name: 'create-rmaline',
        text: 'INSERT INTO public.rma_line(id, rma_id, erp_line_id, model_number, serial_number, product_id) VALUES ($1,$2,$3,$4,$5,$6)',
        values: [id, request.rma_id, request.erp_line_id, request.model_number, request.serial_number, request.product_id]
      }

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(ins_stmt, (err, res) => {
            done();

            if(err)
              reject({"result":-1,"executed":ins_stmt,"error":err});

            resolve({"executed":ins_stmt});

         })
      })

  })

  return promise;
},

deleteRMALine: function(id) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'delete-rmaline',
        text: "delete from rma_line where id = $1",
        values: [id]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();

            if(err)
              reject({"result":-1,"executed":query,"error":err});

            else
              resolve({"deleted rmaline id":id});
         })
      })

  })

  return promise;
},

 fetchRMALines: function(id) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-rmalines-byrma',
        text: 'SELECT id, product_id, rma_id, erp_line_id, status, reason, exception, model_number, serial_number from rma_line where rma_id = $1',
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

createProductMaster: function(id, status, request) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const ins_stmt = {
        name: 'create-productmaster',
        text: 'INSERT INTO public.product_master(id, name, model_number, inventory_status, inventory_count, inventory_min, warehouse_id, bin) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
        values: [id, request.name, request.model_number, request.inventory_status, request.inventory_count, request.inventory_min, request.warehouse_id, request.bin]
      }

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(ins_stmt, (err, res) => {
            done();

            if(err)
              reject({"result":-1,"executed":ins_stmt,"error":err});

            resolve({"executed":ins_stmt});

         })
      })

  })

  return promise;
},

deleteProductMaster: function(id) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'delete-productmaster',
        text: "delete from product_master where id = $1",
        values: [id]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();

            if(err)
              reject({"result":-1,"executed":query,"error":err});

            else
              resolve({"deleted product_master id":id});
         })
      })

  })

  return promise;
},

fetchProductMasterAll: function() {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-productmaster-all',
        text: 'select pm.name, pm.model_number, pm.inventory_status, pm.inventory_count, pm.inventory_min, pm.warehouse_id, pm.bin, w.geography, w.location, w.name warehouse_name from product_master pm, warehouse w where pm.warehouse_id = w.id'
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

createPurchasedProduct: function(id, status, request) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const ins_stmt = {
        name: 'create-purchasedproduct',
        text: 'INSERT INTO public.purchased_product(id, name, created, purchase_date, product_id, data_1, data_2, model_number, warranty_status, c_id, serial_number) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',
        values: [id, request.name, 'now()', request.purchase_date, request.product_id, request.data_1, request.data_2, request.model_number, request.warranty_status, request.c_id, request.serial_number] 
      }

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(ins_stmt, (err, res) => {
            done();

            if(err)
              reject({"result":-1,"executed":ins_stmt,"error":err});

            resolve({"executed":ins_stmt});

         })
      })

  })

  return promise;
},

deletePurchasedProduct: function(id) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'delete-purchasedproduct',
        text: "delete from purchased_product where id = $1",
        values: [id]
      };

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(query, (err, res) => {

            done();

            if(err)
              reject({"result":-1,"executed":query,"error":err});

            else
              resolve({"deleted purchased_product id":id});
         })
      })

  })

  return promise;
},

fetchPurchasedProductByContact: function(id) {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-purchased-product-bycontact',
        text: 'select id, name, created, purchase_date, product_id, data_1, data_2,model_number, warranty_status, c_id, serial_number from purchased_product where c_id = $1',
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

fetchWarehouseAll: function() {
  var promise = new Bluebird(
    function(resolve, reject) {

      const query = {
        name: 'fetch-warehouse-all',
        text: 'SELECT id, geography, location, name from warehouse'
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
 **/
updatePurchasedProduct: function(request) {

  var promise = new Bluebird(
    function(resolve, reject) {


      var arr = Object.keys(request);
      var cnt = 0;
      var stringArr = [];
      var whereClause = '';
      var vals = Object.values(request);

      arr.forEach(x => {
        cnt++;

        if(x != 'id')
          stringArr.push(x + " = $" + cnt);
        else
          whereClause = ' where id = $' + cnt;

      });

      const ins_stmt = {
        name: 'update-purchased-product',
        text: 'UPDATE purchased_product SET ' + stringArr.join() + whereClause,
        values: vals 
      }

      console.log(ins_stmt);

      pool.connect((err, client, done) => {
        if (err) throw err;

          client.query(ins_stmt, (err, res) => {
            done();

            if(err)
              reject({"result":-1,"executed":ins_stmt,"error":err});

            var result = Object.assign({used_qty:null}, request);

            resolve(result);
         })
      })

  })

  return promise;
},

validateProduct: function (request) {

  var validationPromises = [];

  request.forEach(ver => {

      var promise = new Bluebird(

        function (resolve, reject) {

          const query = {
            name: 'fetch-warehouse-all',
            text: 'select purchased_product.serial_number, product_master.model_number, product_master.inventory_count from product_master left outer join purchased_product on (product_master.id = purchased_product.product_id and purchased_product.c_id = $1) where product_master.model_number = $2',
          values: [ver.c_id, ver.model_number]
        };

        pool.connect((err, client, done) => {
          if (err) throw err;

          client.query(query, (err, res) => {

            done();
            if (err)
              reject({
                "result": -1,
                "executed": query,
                "error": err
              });

            else {
              //resolve(res.rows);
              if(res.rows.length == 0) {
                let obj = {serial_number:null, model_number:null, warrantyStatus:null, inventoryStatus:null};
                resolve(obj);
              }
              else { 
                
                let warr = res.rows[0].serial_number == null ? "Out of Warranty" : "In Warranty"; 
                let obj = {serial_number:res.rows[0].serial_number, model_number:res.rows[0].model_number, warrantyStatus:warr, inventoryStatus:res.rows[0].inventory_count};
                resolve(obj);
              }
            }
          })
        })

      });

    validationPromises.push(promise);

  });

  return Promise.all(validationPromises);

},



};

