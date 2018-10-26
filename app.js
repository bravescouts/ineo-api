const express = require('express')
const app = express()
var job = require('./job')
var employee = require('./employee')
var customer = require('./customer')
var util = require('./util')
var site = require('./site')
var rule = require('./rule')
var materialestimate = require('./materialestimate')
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json()
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get('/', function (req, res) {
  res.send('GET request to the homepage')
})

app.use('/job', job);
app.use('/employee', employee);
app.use('/customer', customer);
app.use('/site', site);
app.use('/materialestimate', materialestimate);
app.use('/rule', rule);
app.use('/util', util);

app.listen(5000, () => console.log('app listening on port 5000!'))
