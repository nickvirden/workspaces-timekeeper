var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("Hello world!");
  // res.render('index', { title: 'Express' });
});

router.post('/checkIn', function(req, res, next) {
  req.body.content;
  res.send('Hello there Mr!')
});

router.post('/checkOut', function(req, res, next) {
  req.body.content;
  res.send('Hey there Mrs!')
});

module.exports = router;
