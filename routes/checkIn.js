var express = require('express');
var router = express.Router();

// GET
router.get('/', function(req, res, next) {
  res.send("Hello world!");
});

// POST
router.post('/checkIn', function(req, res, next) {

  req.body.content;
  res.send('Hello there Mr!');

});

module.exports = router;
