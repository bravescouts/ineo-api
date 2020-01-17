const express = require('express')
const app = express()
var fs = require('fs')
var https = require('https')
var job = require('./job')
var employee = require('./employee')
var customer = require('./customer')
var util = require('./util')
var site = require('./site')
var rule = require('./rule')
var training = require('./training')
var note = require('./note')
var task = require('./task')
var rma = require('./rma')
var rmaline = require('./rmaline')
var productmaster = require('./productmaster')
var purchasedproduct = require('./purchasedproduct')
var materialestimate = require('./materialestimate')
var warehouse = require('./warehouse')
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
app.use('/training', training);
app.use('/util', util);
app.use('/note', note);
app.use('/task', task);
app.use('/rma', rma);
app.use('/rmaline', rmaline);
app.use('/productmaster', productmaster);
app.use('/purchasedproduct', purchasedproduct);
app.use('/warehouse', warehouse);

/*
https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app)
.listen(5000, function () {
  console.log('https app listening on port 5000!')
})
*/

app.listen(5000, () => console.log('app listening on port 5000!'))
