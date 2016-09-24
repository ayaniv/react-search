var express = require('express');
var _ = require('lodash');
var app = express();

var APP_PORT = 8081;

app.use(express.static('public'));
app.use('/scripts', express.static(__dirname + '/node_modules/'));

app.listen(APP_PORT, function () {
  console.log("App listening at http://localhost:%s", APP_PORT)
})