const express = require('express')
const app = express()
var job = require('./job')
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json()
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('GET request to the homepage')
})

app.use('/job', job);

app.listen(5000, () => console.log('app listening on port 5000!'))
