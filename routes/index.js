var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("Hello world!");
  // res.render('index', { title: 'Express' });
});

router.post('/checkIn', function(req, res, next) {
  req.body.content;
});

router.post('/checkOut', function(req, res, next) {
  req.body.content;
});

module.exports = router;
