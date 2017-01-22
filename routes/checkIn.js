var express = require('express');
var router = express.Router();
var request = require('request');

// GET
router.get('/', function(req, res, next) {
  res.send("Hello world!");
});

// POST
router.post('/', function(req, res, next) {

  console.log("Posting to Harvest!")

  // POST TO HARVEST
  request({
    method: 'GET',
    uri: 'https://nickvirden.harvestapp.com/account/who_am_i',
    multipart: [{
      'content-type': 'application/xml',
      'accept': 'application/xml',
      'authorization': `Basic ${btoa("nickvirden@gmail.com:13374ppl3s")}`
    }];
  }, function (error, response, body) {
    if (error) {
      return console.error('Nothing returned')
    }

    console.log("Got it!");
    console.log(body);

  });

});

module.exports = router;
