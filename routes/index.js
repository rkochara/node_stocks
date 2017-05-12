var express = require('express');
var router = express.Router();
var path = require('path');

var http = require('http');
var i = 0;
var numProcessed = 0;
var companies = ["AMD"];
var stockDetailsObj;

function compLoop() {
  var options = {
    host: 'www.google.com',
    port: 80,
    path: '/finance/info?q=NASDAQ:' + companies[i],
    method:'GET'
  };

  var request = http.request(options, function (res) {
    var data = '';
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on('end', function () {
      var stockDetails = data.replace(/\/\//i, '');
      stockDetailsObj = JSON.parse(stockDetails);
      numProcessed++;
      console.log(numProcessed + '. ' + stockDetailsObj[0].t +  ' ' + stockDetailsObj[0].l + ' ' + stockDetailsObj[0].c + ' ' + stockDetailsObj[0].cp);

    });
  });

  request.on('error', function (e) {
    console.log(e.message);
  });
  request.end()

  router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
  });

  router.get('/data', function(req,res){
    res.json(stockDetailsObj);
  });

}

setTimeout(compLoop,200);

module.exports = router;
