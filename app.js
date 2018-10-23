const express = require('express')
const app = express()
var job = require('./job')
var employee = require('./employee')
var customer = require('./customer')
var site = require('./site')
var materialestimate = require('./materialestimate')
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json()
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('GET request to the homepage')
})

app.use('/job', job);
app.use('/employee', employee);
app.use('/customer', customer);
app.use('/site', site);
app.use('/materialestimate', materialestimate);

app.listen(5000, () => console.log('app listening on port 5000!'))
